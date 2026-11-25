import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/Providers";
import { SplashScreen } from "@/components/SplashScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TwendaChina - Electronics Store",
  description: "Shop the latest electronics in Zambia at TwendaChina. Phones, tablets and computers from Apple, Samsung, Google and more — pay securely in Kwacha.",
  keywords: ["TwendaChina", "Electronics", "Phones", "Tablets", "Computers", "Laptops", "Zambia", "Smartphones", "iPad"],
  authors: [{ name: "TwendaChina" }],
  other: {
    "darkreader-lock": "",
  },
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "TwendaChina - Electronics Store",
    description: "Shop the latest phones, tablets and computers in Zambia. Pay securely in Kwacha.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          <SplashScreen />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
