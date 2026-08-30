import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "African Chess Academy | Learn, Play, Compete, Improve",
  description: "A unified digital platform for African Chess Academy students, coaches, and tournaments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={\ antialiased min-h-screen flex flex-col}>
        {children}
      </body>
    </html>
  );
}
