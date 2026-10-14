import { mulberry32 } from "../core/rng";

/**
 * The whole sound, in seconds. Short enough that it is over before the lose dialog
 * has finished appearing - a bang that outlives the thing it is announcing reads as
 * a bug, not as feedback.
 */
const DURATION = 0.45;

/** Quiet on purpose. The red cell, the revealed mines and the dialog already told
 * the player they lost (NFR-A11Y-08); this is a fourth channel, not a jump scare. */
const PEAK_GAIN = 0.35;

/** Long enough to avoid a click at the front, short enough to still be a bang. */
const ATTACK = 0.006;

/** The last stretch, spent ramping onto exact zero. */
const TAIL = 0.02;

/**
 * The lowpass closes over the life of the sound. This is what turns hiss into thud:
 * in a real blast the high end dies first, so a filter that stays open sounds like
 * static and one that starts closed sounds like nothing at all.
 */
const FILTER_START_HZ = 1800;
const FILTER_END_HZ = 120;

/** exponentialRampToValueAtTime rejects 0, so decays aim here and land on 0 with a
 * final linear ramp. */
const NEAR_SILENT = 0.0001;

/**
 * Fixed seed - invariant #5, nothing in this project calls Math.random directly.
 * There is exactly one sound, so one waveform is all it ever needs; a constant seed
 * costs nothing audible and lets the test assert on the samples themselves rather
 * than on a probability.
 */
const NOISE_SEED = 0x5eed;

type AudioContextConstructor = new () => AudioContext;

/**
 * Creates the context lazily, and only from globalThis - never `window`, so this
 * module imports cleanly with no DOM at all.
 *
 * There is deliberately no module-level context (ADR-0008): sound defaults to off,
 * so for most players a context created at load is a live audio graph held open for
 * a feature they never switch on.
 */
export function createAudioContext(): AudioContext | null {
  const scope = globalThis as {
    AudioContext?: AudioContextConstructor;
    webkitAudioContext?: AudioContextConstructor;
  };
  const Ctor = scope.AudioContext ?? scope.webkitAudioContext;
  if (!Ctor) return null;
  try {
    return new Ctor();
  } catch {
    return null;
  }
}

/**
 * Plays one explosion on the given context: white noise through a lowpass that
 * closes as a fast envelope decays.
 *
 * The context arrives as a parameter rather than from a module global. That is what
 * makes the sound testable in an environment with no Web Audio, and it keeps the
 * decision of when to create a context with the caller who knows whether the player
 * asked for sound.
 *
 * It never throws. A browser that refuses to build one of these nodes must cost the
 * player a sound, never their board - so every node is built inside the try and
 * `start` is the last call, which leaves a refused graph silent rather than
 * half-started.
 */
export function playExplosion(context: AudioContext): void {
  try {
    const startAt = context.currentTime;
    const decayEnd = startAt + DURATION - TAIL;
    const endAt = startAt + DURATION;

    const buffer = context.createBuffer(
      1,
      Math.ceil(context.sampleRate * DURATION),
      context.sampleRate,
    );
    const samples = buffer.getChannelData(0);
    const random = mulberry32(NOISE_SEED);
    for (let i = 0; i < samples.length; i += 1) {
      samples[i] = random() * 2 - 1;
    }

    const source = context.createBufferSource();
    source.buffer = buffer;

    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(FILTER_START_HZ, startAt);
    filter.frequency.exponentialRampToValueAtTime(FILTER_END_HZ, endAt);

    const gain = context.createGain();
    // Starts near-silent rather than at 0 because the exponential decay below cannot
    // begin at 0, and jumping straight to peak is itself a click.
    gain.gain.setValueAtTime(NEAR_SILENT, startAt);
    gain.gain.linearRampToValueAtTime(PEAK_GAIN, startAt + ATTACK);
    gain.gain.exponentialRampToValueAtTime(NEAR_SILENT, decayEnd);
    // Exact zero, not 0.0001: stopping on a non-zero sample is an audible click.
    gain.gain.linearRampToValueAtTime(0, endAt);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);

    source.start(startAt);
    source.stop(endAt);
  } catch {
    // Silence is an acceptable outcome here; an exception mid-move is not.
  }
}
