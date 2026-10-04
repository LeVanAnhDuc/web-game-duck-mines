declare namespace NodeJS {
  interface ProcessEnv {
    /** Site sub-path, e.g. "/web-game-duck-mines". Empty or unset = site root. */
    NEXT_PUBLIC_BASE_PATH?: string;
    /** Ducker ID sign-in is on only when this is exactly "true". */
    NEXT_PUBLIC_FEATURE_DUCKER_SIGN_IN?: string;
    NEXT_PUBLIC_DUCKER_ISSUER?: string;
    NEXT_PUBLIC_DUCKER_CLIENT_ID?: string;
    NEXT_PUBLIC_DUCKER_SCOPE?: string;
    NEXT_PUBLIC_DUCKER_PROFILE_PATH?: string;
  }
}
