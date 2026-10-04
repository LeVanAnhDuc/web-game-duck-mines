"use client";

// libs
import { useEffect, useSyncExternalStore } from "react";

// types
import type { AuthSnapshot } from "@/auth/types";

// others
import { DUCKER_CONFIG } from "@/auth/constants";
import { settleCallbackUrl } from "@/auth/duckerAuth";
import {
  getServerSnapshot,
  getSnapshot,
  signIn,
  signOut,
  subscribe,
} from "@/auth/duckerSession";

export function useDuckerAuth(): AuthSnapshot & {
  enabled: boolean;
  profileUrl: string | null;
  signIn: () => void;
  signOut: () => void;
} {
  useEffect(() => settleCallbackUrl(), []);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    ...snapshot,
    enabled: DUCKER_CONFIG !== null,
    profileUrl: DUCKER_CONFIG ? DUCKER_CONFIG.profileUrl : null,
    signIn,
    signOut,
  };
}
