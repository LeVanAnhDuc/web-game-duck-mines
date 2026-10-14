"use client";

// libs
import { LogIn, LogOut, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// hooks
import { useAccountMenu, useDuckerAuth } from "@/hooks";

// others
import { initialOf } from "@/lib/initials";
import { strings } from "@/lib/strings";

/**
 * Optional Ducker ID sign-in (ADR-0013). Renders nothing unless the feature flag and
 * every Ducker ID variable are set, so the deployed build never shows it.
 * Neutral on purpose: MASTER.md says anything outside the board that has a colour is
 * wrong, so the avatar and the menu only use the fg/bg tokens.
 */
export function AccountButton() {
  const auth = useDuckerAuth();
  const menu = useAccountMenu();
  const signInRef = useRef<HTMLButtonElement>(null);
  const focusSignIn = useRef(false);
  const [pictureFailed, setPictureFailed] = useState(false);
  const signedIn = auth.status === "signed-in" && auth.profile !== null;

  // After "Đăng xuất" the trigger unmounts; focus must land on the sign-in button in
  // the same slot, never on <body>.
  useEffect(() => {
    if (!signedIn && focusSignIn.current) {
      focusSignIn.current = false;
      signInRef.current?.focus();
    }
  }, [signedIn]);

  if (!auth.enabled) return null;

  // Server and first client render: an inert slot of the same size as the sign-in
  // button, so nothing can be clicked before hydration and the header does not shift.
  if (auth.status === "idle") return <span className="ms-iconbtn" aria-hidden="true" />;

  if (!signedIn || !auth.profile) {
    const loading = auth.status === "loading";
    return (
      <button
        ref={signInRef}
        type="button"
        className="ms-iconbtn"
        data-testid="account-sign-in"
        aria-label={loading ? strings.account.signingIn : strings.account.signIn}
        aria-busy={loading}
        disabled={loading}
        onClick={auth.signIn}
      >
        <LogIn aria-hidden="true" />
      </button>
    );
  }

  const { profile } = auth;
  const name = profile.name?.trim();
  const main = name || profile.email?.trim() || "";
  return (
    <div className="ms-account">
      <button
        ref={menu.triggerRef}
        type="button"
        className="ms-iconbtn"
        data-testid="account-trigger"
        aria-haspopup="menu"
        aria-expanded={menu.open}
        aria-label={strings.account.menuLabel}
        onClick={menu.toggle}
      >
        <span className="ms-avatar">
          {profile.picture && !pictureFailed ? (
            // eslint-disable-next-line @next/next/no-img-element -- static export, external avatar
            <img
              src={profile.picture}
              alt=""
              width={32}
              height={32}
              referrerPolicy="no-referrer"
              onError={() => setPictureFailed(true)}
            />
          ) : (
            <span aria-hidden="true">{initialOf(profile)}</span>
          )}
        </span>
      </button>
      {menu.open && (
        <div
          ref={menu.menuRef}
          role="menu"
          className="ms-account-menu"
          data-testid="account-menu"
        >
          <div className="ms-account-who" role="none">
            {main ? <p className="ms-account-name">{main}</p> : null}
            {name && profile.email ? (
              <p className="ms-account-email">{profile.email}</p>
            ) : null}
          </div>
          <a
            role="menuitem"
            className="ms-account-item"
            href={auth.profileUrl ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => menu.close(false)}
          >
            <UserRound aria-hidden="true" />
            {strings.account.openProfile}
          </a>
          <button
            role="menuitem"
            type="button"
            className="ms-account-item"
            onClick={() => {
              focusSignIn.current = true;
              menu.close(false);
              auth.signOut();
            }}
          >
            <LogOut aria-hidden="true" />
            {strings.account.signOut}
          </button>
        </div>
      )}
    </div>
  );
}
