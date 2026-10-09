
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TECHNOVA Computers",
  description:
    "Explore computer hardware, accessories and technology at TECHNOVA Computers.",
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

