import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createAudioContext, playExplosion } from "./explosion";

// happy-dom implements no Web Audio at all, so the whole graph is faked here. The fake
// records structure rather than sound: which nodes were built, what they were connected
// to, and every value scheduled on a parameter. Being able to write this fake at all is
// the entire reason playExplosion takes its context as an argument.

type ParamEvent = {
  readonly method: string;
  readonly value: number;
  readonly time: number;
};

type FakeParam = {
  readonly events: ParamEvent[];
  setValueAtTime(value: number, time: number): void;
  linearRampToValueAtTime(value: number, time: number): void;
  exponentialRampToValueAtTime(value: number, time: number): void;
};

type FakeBuffer = {
  readonly numberOfChannels: number;
  readonly length: number;
  readonly sampleRate: number;
  getChannelData(channel: number): Float32Array;
};

type Recorded = {
  readonly sampleRate: number;
  readonly currentTime: number;
  readonly created: string[];
  readonly connections: string[][];
  readonly startTimes: number[];
  readonly stopTimes: number[];
  buffer: FakeBuffer | null;
  filterType: string | null;
  readonly frequency: FakeParam;
  readonly gain: FakeParam;
};

type FactoryName =
  | "createBuffer"
  | "createBufferSource"
  | "createBiquadFilter"
  | "createGain";

function fakeParam(): FakeParam {
  const events: ParamEvent[] = [];
  const record = (method: string) => (value: number, time: number) => {
    events.push({ method, value, time });
  };
  return {
    events,
    setValueAtTime: record("setValueAtTime"),
    linearRampToValueAtTime: record("linearRampToValueAtTime"),
    exponentialRampToValueAtTime: record("exponentialRampToValueAtTime"),
  };
}

function createFakeContext(
  options: { sampleRate?: number; currentTime?: number; throwOn?: FactoryName } = {},
) {
  const sampleRate = options.sampleRate ?? 48000;
  const currentTime = options.currentTime ?? 0;
  const destination = { id: "destination" };

  const state: Recorded = {
    sampleRate,
    currentTime,
    created: [],
    connections: [],
    startTimes: [],
    stopTimes: [],
    buffer: null,
    filterType: null,
    frequency: fakeParam(),
    gain: fakeParam(),
  };

  const enter = (name: FactoryName) => {
    state.created.push(name);
    if (options.throwOn === name) throw new Error(name + " is unavailable");
  };
  const connectFrom = (id: string) => (target: { id: string }) => {
    state.connections.push([id, target.id]);
  };

  const context = {
    sampleRate,
    currentTime,
    destination,

    createBuffer(channelCount: number, length: number, rate: number): FakeBuffer {
      enter("createBuffer");
      const channels = Array.from(
        { length: channelCount },
        () => new Float32Array(length),
      );
      const buffer: FakeBuffer = {
        numberOfChannels: channelCount,
        length,
        sampleRate: rate,
        getChannelData: (channel: number) => channels[channel],
      };
      state.buffer = buffer;
      return buffer;
    },

    createBufferSource() {
      enter("createBufferSource");
      return {
        id: "source",
        buffer: null as FakeBuffer | null,
        connect: connectFrom("source"),
        start: (when: number) => {
          state.startTimes.push(when);
        },
        stop: (when: number) => {
          state.stopTimes.push(when);
        },
      };
    },

    createBiquadFilter() {
      enter("createBiquadFilter");
      return {
        id: "filter",
        set type(value: string) {
          state.filterType = value;
        },
        frequency: state.frequency,
        connect: connectFrom("filter"),
      };
    },

    createGain() {
      enter("createGain");
      return { id: "gain", gain: state.gain, connect: connectFrom("gain") };
    },
  };

  return { state, context: context as unknown as AudioContext };
}

describe("playExplosion", () => {
  it("builds a noise buffer that runs for a fraction of a second", () => {
    const { state, context } = createFakeContext({ sampleRate: 48000 });
    playExplosion(context);
    expect(state.buffer).not.toBeNull();
    expect(state.buffer!.length).toBeGreaterThan(48000 * 0.15);
    expect(state.buffer!.length).toBeLessThan(48000);
    expect(state.buffer!.sampleRate).toBe(48000);
  });

  it("scales the buffer with the sample rate instead of fixing a sample count", () => {
    // the same sound on a 44.1k and on a 48k device has to last the same number of
    // seconds, not the same number of samples
    const slow = createFakeContext({ sampleRate: 44100 });
    const fast = createFakeContext({ sampleRate: 48000 });
    playExplosion(slow.context);
    playExplosion(fast.context);
    const ratio = fast.state.buffer!.length / slow.state.buffer!.length;
    expect(ratio).toBeCloseTo(48000 / 44100, 3);
  });

  it("fills the buffer with audible noise rather than silence", () => {
    // a graph wired perfectly but playing an empty buffer is silent, and every
    // structural assertion below still passes - this is the test that catches it
    const { state, context } = createFakeContext();
    playExplosion(context);
    const samples = state.buffer!.getChannelData(0);
    expect(samples.length).toBeGreaterThan(0);
    let peak = 0;
    for (let i = 0; i < samples.length; i += 1) {
      expect(Math.abs(samples[i])).toBeLessThanOrEqual(1);
      peak = Math.max(peak, Math.abs(samples[i]));
    }
    expect(peak).toBeGreaterThan(0.5);
  });

  it("runs the source through the filter and the gain before the destination", () => {
    const { state, context } = createFakeContext();
    playExplosion(context);
    expect(state.connections).toEqual([
      ["source", "filter"],
      ["filter", "gain"],
      ["gain", "destination"],
    ]);
  });

  it("filters the noise with a lowpass", () => {
    const { state, context } = createFakeContext();
    playExplosion(context);
    expect(state.filterType).toBe("lowpass");
  });

  it("closes the filter as the sound decays", () => {
    const { state, context } = createFakeContext();
    playExplosion(context);
    const events = state.frequency.events;
    expect(events.length).toBeGreaterThanOrEqual(2);
    const first = events[0];
    const last = events[events.length - 1];
    expect(last.value).toBeLessThan(first.value);
    // a real browser throws on an exponential ramp aimed at 0
    expect(last.value).toBeGreaterThan(0);
    expect(last.time).toBeGreaterThan(first.time);
  });

  it("ends the gain envelope on exactly zero so the sound does not click off", () => {
    const { state, context } = createFakeContext();
    playExplosion(context);
    const events = state.gain.events;
    expect(events.length).toBeGreaterThanOrEqual(2);
    expect(events[events.length - 1].value).toBe(0);
  });

  it("rises to its peak early instead of starting at full volume", () => {
    const { state, context } = createFakeContext();
    playExplosion(context);
    const events = state.gain.events;
    const peak = Math.max(...events.map((event) => event.value));
    expect(events[0].value).toBeLessThan(peak);
    expect(peak).toBeLessThanOrEqual(1);
    // the peak arrives within milliseconds - this is a bang, not a swell
    const peakEvent = events.find((event) => event.value === peak)!;
    expect(peakEvent.time).toBeLessThan(0.05);
  });

  it("schedules everything from the context clock, not from zero", () => {
    const { state, context } = createFakeContext({ currentTime: 12.5 });
    playExplosion(context);
    expect(state.gain.events[0].time).toBe(12.5);
    expect(state.frequency.events[0].time).toBe(12.5);
    expect(state.startTimes).toEqual([12.5]);
  });

  it("starts the source exactly once and stops it after it has played", () => {
    const { state, context } = createFakeContext();
    playExplosion(context);
    expect(state.startTimes).toHaveLength(1);
    expect(state.stopTimes).toHaveLength(1);
    expect(state.stopTimes[0]).toBeGreaterThan(state.startTimes[0]);
  });

  const factories: FactoryName[] = [
    "createBuffer",
    "createBufferSource",
    "createBiquadFilter",
    "createGain",
  ];

  it.each(factories)("stays silent instead of throwing when %s fails", (throwOn) => {
    // losing the sound is acceptable; losing the board to an exception is not
    const { state, context } = createFakeContext({ throwOn });
    expect(() => playExplosion(context)).not.toThrow();
    expect(state.startTimes).toEqual([]);
    expect(state.connections).toEqual([]);
  });

  it("does not throw when handed a context with no methods at all", () => {
    expect(() => playExplosion({} as unknown as AudioContext)).not.toThrow();
  });
});

describe("createAudioContext", () => {
  const scope = globalThis as unknown as Record<string, unknown>;
  const keys = ["AudioContext", "webkitAudioContext"];
  let saved: Record<string, unknown> = {};

  beforeEach(() => {
    saved = { AudioContext: scope.AudioContext, webkitAudioContext: scope.webkitAudioContext };
    for (const key of keys) delete scope[key];
  });

  afterEach(() => {
    for (const key of keys) {
      if (saved[key] === undefined) delete scope[key];
      else scope[key] = saved[key];
    }
  });

  it("returns null when neither constructor exists on globalThis", () => {
    expect(createAudioContext()).toBeNull();
  });

  it("builds a context from the standard constructor when there is one", () => {
    class Stub {}
    scope.AudioContext = Stub;
    expect(createAudioContext()).toBeInstanceOf(Stub);
  });

  it("falls back to the webkit-prefixed constructor", () => {
    class Stub {}
    scope.webkitAudioContext = Stub;
    expect(createAudioContext()).toBeInstanceOf(Stub);
  });

  it("returns null when the browser refuses to construct a context", () => {
    // Safari throws once a page holds too many contexts; that must not reach the caller
    scope.AudioContext = function Refusing() {
      throw new Error("too many contexts");
    };
    expect(createAudioContext()).toBeNull();
  });
});
