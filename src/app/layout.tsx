// layout.tsx
import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import { ThemeProvider } from "../context/ThemeContext";  
import "./globals.css";

const inter = Exo_2({
  subsets: ["latin"],
  weight: "400"
});

export const metadata: Metadata = {
  title: "Tunify Music Player",
  description: "A bug free music player",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
