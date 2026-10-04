import type { NextConfig } from "next";

/**
 * GitHub Pages serves the site from /<repo-name>; running locally it sits at the
 * root. NEXT_PUBLIC_BASE_PATH is set only by the deploy workflow (and by a developer
 * who wants to rehearse it), so `pnpm dev` and a local `pnpm build` keep serving from
 * the root. Unset or empty means the site root - an explicit branch, not a default.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : undefined;

const nextConfig: NextConfig = {
  /**
   * The whole game runs client-side, so it exports to static HTML: no Node server,
   * and the infrastructure ceiling in docs/01-product/overview.md stays at 0 VND.
   * This is here from the first commit on purpose - adding it later surfaces a pile
   * of things that do not export.
   */
  output: "export",
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
