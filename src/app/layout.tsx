import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BPSTW",
  description: "BPSTW - Balai Pelayanan Tresna Werdha",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        {/* Fixed background SVG */}
        <div
          className="fixed inset-0 z-[-1] w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/background_black.png')" }}
        ></div>
        {children}
      </body>
    </html>
  );
}