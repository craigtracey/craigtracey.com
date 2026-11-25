import type { Metadata } from "next";
import "./globals.css";

const googleTagId = "G-R9EYHELZC4";
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
  return (
    <html lang="en">
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`} />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){ window.dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', '${googleTagId}');
        ` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
