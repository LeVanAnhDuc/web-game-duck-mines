import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_SETTINGS, type Settings } from "@/game/settings/types";
import type { BestTimes } from "@/game/score/ScoreRepository";
import { SettingsSheet, type SettingsSheetProps } from "./SettingsSheet";

const NO_RECORDS: BestTimes = { beginner: null, intermediate: null, expert: null };

function open(overrides: Partial<SettingsSheetProps> = {}) {
  const props: SettingsSheetProps = {
    open: true,
    settings: DEFAULT_SETTINGS,
    bestTimes: NO_RECORDS,
    inProgress: false,
    storageAvailable: true,
    onUpdate: vi.fn(),
    onPickDifficulty: vi.fn(),
    onClearRecords: vi.fn(),
    onClose: vi.fn(),
    ...overrides,
  };
  render(<SettingsSheet {...props} />);
  return props;
}

describe("SettingsSheet - what it shows", () => {
  it("renders nothing at all when closed", () => {
    open({ open: false });
    expect(screen.queryByTestId("settings-sheet")).toBeNull();
  });

  it("lists the three preset difficulties with their shape, and checks the current one", () => {
    open({ settings: { ...DEFAULT_SETTINGS, difficulty: "intermediate" } });
    expect(screen.getByTestId("difficulty-beginner").getAttribute("aria-checked")).toBe("false");
    expect(screen.getByTestId("difficulty-intermediate").getAttribute("aria-checked")).toBe("true");
    expect(screen.getByTestId("difficulty-expert").textContent).toContain("30×16");
    expect(screen.getByTestId("difficulty-expert").textContent).toContain("99");
  });

  it("uses sentence case for its headings, never tracked-out capitals", () => {
    open();
    for (const heading of screen.getAllByRole("heading", { level: 3 })) {
      const text = heading.textContent ?? "";
      expect(text).not.toBe(text.toUpperCase());
    }
  });

  it("shows an em dash for a difficulty with no record yet, and m:ss for one with", () => {
    open({ bestTimes: { beginner: 47, intermediate: null, expert: 754 } });
    expect(screen.getByTestId("record-beginner").textContent).toBe("0:47");
    expect(screen.getByTestId("record-intermediate").textContent).toBe("—");
    expect(screen.getByTestId("record-expert").textContent).toBe("12:34");
  });

  it("says so when the machine will not keep records, rather than pretending it saved", () => {
    open({ storageAvailable: false });
    expect(screen.getByText(/không cho lưu/)).toBeTruthy();
  });
});

describe("SettingsSheet - changing difficulty", () => {
  it("switches immediately when no board is under way", () => {
    const props = open({ inProgress: false });
    fireEvent.click(screen.getByTestId("difficulty-expert"));
    expect(props.onPickDifficulty).toHaveBeenCalledWith("expert");
    expect(screen.queryByTestId("abandon-confirm")).toBeNull();
  });

  it("asks first when a board IS under way, and does nothing until answered", () => {
    const props = open({ inProgress: true });
    fireEvent.click(screen.getByTestId("difficulty-expert"));
    expect(props.onPickDifficulty).not.toHaveBeenCalled();

    const confirm = screen.getByTestId("abandon-confirm");
    expect(screen.getByText(/Bỏ bàn đang chơi/)).toBeTruthy();
    fireEvent.click(confirm);
    expect(props.onPickDifficulty).toHaveBeenCalledWith("expert");
  });

  it("keeps the board when the question is declined", () => {
    const props = open({ inProgress: true });
    fireEvent.click(screen.getByTestId("difficulty-expert"));
    fireEvent.click(screen.getByText("Giữ lại"));
    expect(props.onPickDifficulty).not.toHaveBeenCalled();
    expect(screen.queryByTestId("abandon-confirm")).toBeNull();
  });

  it("does not ask about the difficulty that is already selected", () => {
    const props = open({ inProgress: true });
    fireEvent.click(screen.getByTestId("difficulty-beginner"));
    expect(screen.queryByTestId("abandon-confirm")).toBeNull();
    expect(props.onPickDifficulty).not.toHaveBeenCalled();
  });
});

describe("SettingsSheet - the switches", () => {
  it("reports the sound switch as off by default - ADR-0008", () => {
    open();
    expect(screen.getByTestId("toggle-sound").getAttribute("aria-checked")).toBe("false");
  });

  it("turns sound on without touching anything else", () => {
    const props = open();
    fireEvent.click(screen.getByTestId("toggle-sound"));
    expect(props.onUpdate).toHaveBeenCalledWith({ sound: true });
  });

  it("turns question marks on and off", () => {
    const props = open({ settings: { ...DEFAULT_SETTINGS, allowUnsure: true } as Settings });
    expect(screen.getByTestId("toggle-unsure").getAttribute("aria-checked")).toBe("true");
    fireEvent.click(screen.getByTestId("toggle-unsure"));
    expect(props.onUpdate).toHaveBeenCalledWith({ allowUnsure: false });
  });

  it("offers all three theme states, because system is not the same as light", () => {
    const props = open();
    expect(screen.getByTestId("theme-system").getAttribute("aria-checked")).toBe("true");
    fireEvent.click(screen.getByTestId("theme-dark"));
    expect(props.onUpdate).toHaveBeenCalledWith({ theme: "dark" });
  });

  it("clears the records on request", () => {
    const props = open();
    fireEvent.click(screen.getByTestId("clear-records"));
    expect(props.onClearRecords).toHaveBeenCalled();
  });
});

describe("SettingsSheet - getting out", () => {
  it("closes on Escape", () => {
    const props = open();
    fireEvent.keyDown(screen.getByTestId("settings-sheet"), { key: "Escape" });
    expect(props.onClose).toHaveBeenCalled();
  });

  it("closes when the backdrop is clicked", () => {
    const props = open();
    fireEvent.click(screen.getByTestId("settings-scrim"));
    expect(props.onClose).toHaveBeenCalled();
  });

  it("does NOT close when the sheet itself is clicked", () => {
    const props = open();
    fireEvent.click(screen.getByTestId("settings-sheet"));
    expect(props.onClose).not.toHaveBeenCalled();
  });

  it("takes focus when it opens, so the keyboard is inside it", () => {
    open();
    expect(document.activeElement).toBe(screen.getByTestId("settings-sheet"));
  });
});
