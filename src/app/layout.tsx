import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: {
    default: "Peptide Daily — Lab-Verified Peptide Price Comparison",
    template: "%s — Peptide Daily",
  },
  description:
    "Compare peptide prices across vendors with third-party lab testing data from Finnrick. Evidence-driven quality ratings, community reviews, and real-time pricing.",
  keywords: ["peptides", "peptide comparison", "Finnrick ratings", "BPC-157", "semaglutide", "research chemicals", "lab testing"],
  openGraph: {
    siteName: "Peptide Daily",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
