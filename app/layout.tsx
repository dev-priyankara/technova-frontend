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
  return (
    <html lang="en">
      <body>
        <AnimatedTechBackground />

        <div className="relative z-10 min-h-screen">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
