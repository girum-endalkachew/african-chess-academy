import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "African Chess Academy | Learn, Play, Compete, Improve",
    template: "%s | African Chess Academy",
  },
  description:
    "A unified digital platform for African Chess Academy — courses, coaches, tournaments, webinars, student portal, and play vs computer.",
  keywords: [
    "African Chess Academy",
    "ACA",
    "chess courses",
    "chess tournaments Ethiopia",
    "learn chess online",
    "chess academy Africa",
  ],
  openGraph: {
    title: "African Chess Academy",
    description: "Learn. Play. Compete. Improve.",
    type: "website",
    locale: "en_US",
    siteName: "African Chess Academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "African Chess Academy",
    description: "Learn. Play. Compete. Improve.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}