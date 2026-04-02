import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

// Setup font Space Mono sesuai request styling brutalist lu
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

// Setup metadata untuk tab browser dan SEO
export const metadata: Metadata = {
  title: "Academic Score Predictor",
  description: "Sistem analitik prediktif berbasis Machine Learning untuk memprediksi probabilitas nilai ujian mahasiswa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-yellow-500 font-mono">
        {children}
      </body>
    </html>
  );
}