import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { newsreader, plexMono, plexSans } from "@/lib/fonts";

const SITE_NAME = "Peptide Daily";
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://peptidedaily.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Peptide Daily \u2014 Lab-Verified Peptide Price Comparison",
    template: "%s \u2014 Peptide Daily",
  },
  description:
    "Compare peptide prices across vendors with third-party lab testing data from Finnrick. Evidence-driven quality ratings, community reviews, and real-time pricing.",
  keywords: [
    "peptides",
    "peptide comparison",
    "peptide prices",
    "Finnrick ratings",
    "BPC-157",
    "semaglutide",
    "research chemicals",
    "lab testing",
    "peptide vendors",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Peptide Daily \u2014 Lab-Verified Peptide Price Comparison",
    description:
      "Compare peptide prices with third-party lab data from Finnrick. Evidence-based quality ratings and real-time pricing.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon-source.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--accent-primary)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
