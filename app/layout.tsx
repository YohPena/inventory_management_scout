import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inventaire scout",
  description: "Gestion du materiel du local scout",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${geist.className} antialiased`}>
        <nav className="flex gap-6 border-b p-4">
          <a href="/" className="font-bold">Inventaire scout</a>
          <a href="/items" className="hover:underline">Materiel</a>
          <a href="/calendar" className="hover:underline text-gray-400">Calendrier</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
