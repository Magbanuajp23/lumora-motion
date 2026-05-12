import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumora Motion | AI Video Editing",
  description:
    "A premium AI video editing platform for turning raw clips into viral cinematic edits, captions, motion effects, and export-ready videos."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
