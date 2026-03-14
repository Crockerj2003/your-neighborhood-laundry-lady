import type { Metadata } from "next";
import { Geist_Mono, Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  weight: "400",
  variable: "--font-rubik",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your neighborhood laundry lady",
  description:
    "Pickup and delivery laundry service using sensitive skin approved products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rubik.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
