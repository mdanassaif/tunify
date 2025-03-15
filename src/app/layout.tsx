import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import { ThemeProvider } from "../context/ThemeContext";
import "./globals.css";

const inter = Exo_2({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Tunify Music Player - Seamless Audio Experience",
  description:
    "Enjoy a bug-free music player created by mdanasssaif. Tunify offers a seamless audio experience with modern features. Updated March 15, 2025.",
  authors: [{ name: "mdanasssaif" }],
  keywords: "Tunify, music player, mdanasssaif, audio app, bug-free music, seamless playback",
  robots: "index, follow",
  openGraph: {
    title: "Tunify Music Player - Seamless Audio Experience",
    description:
      "Discover Tunify, a bug-free music player by mdanasssaif. Enjoy high-quality audio and modern features.",
    url: "https://tunify-music-player.com", // Replace with your actual URL
    siteName: "Tunify Music Player",
    images: [
      {
        url: "https://media.licdn.com/dms/image/v2/D4D22AQFDr7vGAPMhkQ/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1733054334256?e=1744848000&v=beta&t=FISgMXzYD_05Vnb6He45UBDo0uEuSWWTzsU8jechMDs", // Replace with your actual image URL
        width: 1200,
        height: 630,
        alt: "Tunify Music Player by mdanasssaif",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tunify Music Player - Seamless Audio Experience",
    description:
      "A bug-free music player by mdanasssaif. Experience seamless audio with Tunify!",
    creator: "@mdanasssaif", // Replace with your Twitter handle
    images: ["https://media.licdn.com/dms/image/v2/D4D22AQFDr7vGAPMhkQ/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1733054334256?e=1744848000&v=beta&t=FISgMXzYD_05Vnb6He45UBDo0uEuSWWTzsU8jechMDs"], // Replace with your actual image URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#1a73e8" /> {/* Optional: Enhances mobile experience */}
        <link rel="icon" href="/favicon.ico" /> {/* Optional: Add your favicon */}
      </head>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}