import type { Metadata } from "next";
import "./globals.css";
import AnimatedTechBackground from "@/components/AnimatedTechBackground";
import Providers from "@/components/Providers";

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
  // Browser extensions (Zotero Connector, Grammarly, password managers and
  // others) inject attributes such as data-zotero-connector-injected onto
  // <html> before React hydrates. Those mutations are outside the app's
  // control, so keep React from treating them as a hydration mismatch.
  // suppressHydrationWarning only applies to this element's own attributes.
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AnimatedTechBackground />

        <div className="relative z-10 min-h-screen">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
