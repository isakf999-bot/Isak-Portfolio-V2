import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Chrome } from "@/components/Chrome";
import { Grain } from "@/components/Grain";
import { GridOverlay } from "@/components/GridOverlay";
import { JsonLd } from "@/components/JsonLd";
import { Paper } from "@/components/Paper";
import { SmoothScroll } from "@/components/SmoothScroll";
import { WindRoot } from "@/components/WindRoot";
import { siteDescription, siteTitle, siteUrl } from "@/lib/site";
import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "./fonts/satoshi/Satoshi-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/satoshi/Satoshi-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/satoshi/Satoshi-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: true,
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s",
  },
  description: siteDescription,
  authors: [{ name: "Isak Forsberg" }],
  creator: "Isak Forsberg",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "Isak Forsberg",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${geistMono.variable}`}
    >
      <body className="bg-paper text-ink antialiased">
        <JsonLd />
        <Paper />
        <Grain />
        <GridOverlay />
        <WindRoot />
        <SmoothScroll>
          <Chrome>{children}</Chrome>
        </SmoothScroll>
      </body>
    </html>
  );
}
