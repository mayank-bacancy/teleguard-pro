import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeleGuard Pro",
  description: "Cloud-native telecom fraud detection platform.",
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
