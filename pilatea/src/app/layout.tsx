import type { Metadata } from "next";
import { Darker_Grotesque, Poppins, Allura } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";

const darkerGrotesque = Darker_Grotesque({
  variable: "--font-darker-grotesque",
  subsets: ["latin"],
  weight: ["300"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PILATEA — Sip. Stretch. Glow.",
  description:
    "PILATEA blends mindful movement with comforting tea experiences to nourish your body, mind, and soul. Premium Pilates, tea rituals, and community — indoors, outdoors, and on the go.",
  keywords: [
    "Pilates",
    "tea",
    "wellness",
    "PILATEA",
    "mindful movement",
    "Sip Stretch Glow",
  ],
  authors: [{ name: "PILATEA" }],
  openGraph: {
    title: "PILATEA — Sip. Stretch. Glow.",
    description:
      "Mindful movement and comforting tea experiences for body, mind, and soul.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${darkerGrotesque.variable} ${poppins.variable} ${allura.variable}`}
    >
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
