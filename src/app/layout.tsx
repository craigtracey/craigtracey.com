import type { Metadata } from "next";
import "./globals.css";

const title = "Craig Tracey — Founder, Engineer · AI & Infrastructure";
const description = "Founder and hands-on engineer working across AI, infrastructure, and the full stack. Experience building products, selling to, and delivering for the world’s largest companies.";

export const metadata: Metadata = {
  metadataBase: new URL("https://craigtracey.com"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, url: "https://craigtracey.com", siteName: "Craig Tracey", type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
