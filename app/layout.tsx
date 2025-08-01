import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MKFXI | Matbor Kandi Football Ekadosh",
  description: "Matbor Kandi Football Ekadosh - MKFXI",
  manifest: "/manifest.json",
  themeColor: "#7c3aed",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  authors: [
    {
      name: "Nazmul H. Sourab",
      url: "https://www.linkedin.com/in/mdnhs/",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-all duration-300 ease-in`}
      >
        <ServiceWorkerRegistration />
        <Header />
        {children}
      </body>
    </html>
  );
}
