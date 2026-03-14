import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "TeleGuard Pro",
  description:
    "Telecom fraud detection, signaling security, live ingestion, analytics, and revenue assurance for modern operator teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
