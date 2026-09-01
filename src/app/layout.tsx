import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0B1528",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://african-chess-academy.vercel.app"),
  title: {
    default: "African Chess Academy | Where African Talent Becomes Global Excellence",
    template: "%s | African Chess Academy",
  },
  description:
    "Learn from experienced coaches, compete in meaningful tournaments, and develop the strategic mindset to reach your full potential.",
  keywords: [
    "African Chess Academy",
    "African Chess",
    "Chess Academy",
    "Learn Chess Africa",
    "Chess Tournaments Africa",
    "FIDE Coaches",
    "Chess Lessons",
    "Play Chess Online"
  ],
  authors: [{ name: "African Chess Academy", url: "https://african-chess-academy.vercel.app" }],
  creator: "African Chess Academy",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://african-chess-academy.vercel.app",
    title: "African Chess Academy | Center of Excellence",
    description:
      "A unified digital ecosystem for African chess students, coaches, and grandmasters to learn, play, compete, and excel together.",
    siteName: "African Chess Academy",
    images: [
      {
        url: "/hero-knight.png",
        width: 1200,
        height: 630,
        alt: "African Chess Academy - Center of Excellence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "African Chess Academy | Center of Excellence",
    description:
      "Learn from experienced coaches, compete in tournaments, and master chess with structured lessons.",
    images: ["/hero-knight.png"],
    creator: "@AfricanChess",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${manrope.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
