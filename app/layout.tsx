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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://git-wrapped.vercel.app"),
  title: "Git Wrapped - Your Year in Code",
  description: "See your GitHub activity in a beautiful wrapped presentation. Spotify Wrapped, but for your code.",
  openGraph: {
    title: "Git Wrapped - Your Year in Code",
    description: "Spotify Wrapped, but for your code. See your GitHub activity as an animated slideshow.",
    type: "website",
    siteName: "Git Wrapped",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Git Wrapped",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Git Wrapped - Your Year in Code",
    description: "Spotify Wrapped, but for your code. See your GitHub activity as an animated slideshow.",
    images: ["/og.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
