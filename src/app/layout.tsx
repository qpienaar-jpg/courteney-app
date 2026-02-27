import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Courteney",
  description:
    "AI-assisted reproductive health symptom tracking. Log symptoms, consult with an AI assistant, and discover trends — all in one private, supportive space.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-courteney-warm-50`}
      >
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
