import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Roboto,
  Open_Sans,
  Montserrat,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["greek"],
});

export const metadata: Metadata = {
  title: "Eiliya Bill",
  description: "The Billing Sysytem That Grows With Your Bussiness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${roboto.variable} antialiased`}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
