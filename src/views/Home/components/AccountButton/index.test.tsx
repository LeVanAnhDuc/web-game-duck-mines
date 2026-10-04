import { act, fireEvent, render, screen } from "@testing-library/react";
import { useSyncExternalStore } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const store = vi.hoisted(() => {
  const listeners = new Set<() => void>();
  const state = {
    value: {} as Record<string, unknown>,
    signIn: vi.fn(),
    signOutCalls: 0,
  };
  return {
    state,
    listeners,
    set(next: Record<string, unknown>) {
      state.value = next;
      listeners.forEach((l) => l());
    },
  };
});

vi.mock("@/hooks/useDuckerAuth", () => ({
  useDuckerAuth: () => {
    const value = useSyncExternalStore(
      (l) => {
        store.listeners.add(l);
        return () => store.listeners.delete(l);
      },
      () => store.state.value,
      () => store.state.value,
    );
    return {
      ...value,
      signIn: store.state.signIn,
      signOut: () => {
        store.state.signOutCalls += 1;
        store.set({ ...value, status: "signed-out", profile: null });
      },
    };
  },
}));

import { AccountButton } from "./index";

const base = { enabled: true, profileUrl: "http://localhost:3000/profile" };
const signedIn = {
  ...base,
  status: "signed-in",
  profile: { sub: "u1", name: "Lê Văn Anh Đức", email: "duc@ducker.id" },
};

const trigger = () => screen.getByRole("button", { name: "Tài khoản Ducker ID" });
const items = () => screen.getAllByRole("menuitem");

describe("AccountButton", () => {
  beforeEach(() => {
    store.state.signIn.mockClear();
    store.state.signOutCalls = 0;
  });

  it("renders nothing when the feature is disabled", () => {
    store.set({ ...base, enabled: false, status: "idle", profile: null });
    const { container } = render(<AccountButton />);
    expect(container.innerHTML).toBe("");
  });

  it("shows the sign-in button when signed out and starts login on click", () => {
    store.set({ ...base, status: "signed-out", profile: null });
    render(<AccountButton />);
    fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));
    expect(store.state.signIn).toHaveBeenCalledOnce();
  });

  it("disables the button while signing in", () => {
    store.set({ ...base, status: "loading", profile: null });
    render(<AccountButton />);
    const button = screen.getByRole("button", { name: "Đang đăng nhập…" }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("opens the menu with the profile link and sign out; Esc closes and refocuses", () => {
    store.set(signedIn);
    render(<AccountButton />);
    fireEvent.click(trigger());
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Lê Văn Anh Đức")).toBeTruthy();
    expect(screen.getByText("duc@ducker.id")).toBeTruthy();
    const link = screen.getByRole("menuitem", { name: "Mở hồ sơ Ducker ID" });
    expect(link.getAttribute("href")).toBe("http://localhost:3000/profile");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger());
  });

  it("moves focus with the arrow keys, wrapping, and with Home / End", () => {
    store.set(signedIn);
    render(<AccountButton />);
    fireEvent.click(trigger());
    const [profile, signOut] = items();
    expect(document.activeElement).toBe(profile);
    fireEvent.keyDown(document, { key: "ArrowDown" });
    expect(document.activeElement).toBe(signOut);
    fireEvent.keyDown(document, { key: "ArrowDown" });
    expect(document.activeElement).toBe(profile);
    fireEvent.keyDown(document, { key: "ArrowUp" });
    expect(document.activeElement).toBe(signOut);
    fireEvent.keyDown(document, { key: "Home" });
    expect(document.activeElement).toBe(profile);
    fireEvent.keyDown(document, { key: "End" });
    expect(document.activeElement).toBe(signOut);
  });

  it("keeps menu keys away from a game-style window listener while open", () => {
    store.set(signedIn);
    render(<AccountButton />);
    const seen: string[] = [];
    const game = (event: KeyboardEvent) => seen.push(event.key);
    window.addEventListener("keydown", game);
    fireEvent.click(trigger());
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "ArrowUp" });
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    expect(seen).toEqual([]);
    fireEvent.keyDown(document.body, { key: "ArrowUp" });
    expect(seen).toEqual(["ArrowUp"]);
    window.removeEventListener("keydown", game);
  });

  it("closes on Tab without pulling focus back to the menu", () => {
    store.set(signedIn);
    render(<AccountButton />);
    fireEvent.click(trigger());
    fireEvent.keyDown(document, { key: "Tab" });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("closes when focus moves to an element outside, but not on a null relatedTarget", () => {
    store.set(signedIn);
    render(
      <>
        <AccountButton />
        <button type="button">elsewhere</button>
      </>,
    );
    fireEvent.click(trigger());
    fireEvent.focusOut(items()[0], { relatedTarget: null });
    expect(screen.queryByRole("menu")).not.toBeNull();
    fireEvent.focusOut(items()[0], { relatedTarget: screen.getByText("elsewhere") });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("closes on a pointer press outside", () => {
    store.set(signedIn);
    render(<AccountButton />);
    fireEvent.click(trigger());
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("puts focus on the sign-in button after signing out from the menu", () => {
    store.set(signedIn);
    render(<AccountButton />);
    fireEvent.click(trigger());
    fireEvent.click(screen.getByRole("menuitem", { name: "Đăng xuất" }));
    expect(store.state.signOutCalls).toBe(1);
    const signIn = screen.getByRole("button", { name: "Đăng nhập" });
    expect(document.activeElement).toBe(signIn);
  });

  it("shows the email as the main line when there is no name, and no email line without one", () => {
    store.set({ ...signedIn, profile: { sub: "u1", email: "duc@ducker.id" } });
    const { unmount } = render(<AccountButton />);
    fireEvent.click(trigger());
    expect(document.querySelectorAll(".ms-account-email")).toHaveLength(0);
    expect(document.querySelector(".ms-account-name")?.textContent).toBe("duc@ducker.id");
    unmount();

    store.set({ ...signedIn, profile: { sub: "u1", name: "Đức" } });
    render(<AccountButton />);
    fireEvent.click(trigger());
    expect(document.querySelectorAll(".ms-account-email")).toHaveLength(0);
    expect(document.querySelector(".ms-account-name")?.textContent).toBe("Đức");
  });
});
