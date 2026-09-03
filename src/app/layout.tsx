import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { strings } from "@/lib/strings";
import "./globals.css";

/**
 * Two families, deliberately distinct - ADR-0001. Plex Mono carries the board
 * numerals and the two readouts (its `1` has a base serif, so at 22px it cannot be
 * mistaken for an `l`, and tabular figures keep the clock from jittering); Archivo
 * carries UI text.
 */
const archivo = Archivo({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-num",
  display: "swap",
});

export const metadata: Metadata = {
  title: strings.appName,
  description: strings.appDescription,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Zooming stays available: pinching the board is how the expert grid is read on a
  // phone (FR-13), so it must never be locked out.
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${archivo.variable} ${plexMono.variable}`}>{children}</body>
    </html>
  );
}
