import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "National Check-in Week — Student Wellbeing for Australian Schools",
    template: "%s | National Check-in Week",
  },
  description:
    "National Check-in Week (NCIW) is a FREE initiative tackling the student wellbeing crisis in Australian schools. Access free webinars, expert panels, and resources to support your whole school community.",
  keywords: [
    "National Check-in Week",
    "NCIW",
    "Australian schools wellbeing",
    "student mental health Australia",
    "school wellbeing assessment",
    "student check-in",
    "school leader wellbeing tools",
    "emotional literacy schools",
    "student voice",
    "school wellbeing data",
  ],
  metadataBase: new URL("https://schoolswellbeing.com.au"),
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "National Check-in Week",
    title: "National Check-in Week — Student Wellbeing for Australian Schools",
    description:
      "A FREE national initiative empowering school leaders with real-time wellbeing data, expert webinars, and resources to ensure no child falls through the gaps.",
  },
  twitter: {
    card: "summary_large_image",
    title: "National Check-in Week — Student Wellbeing for Australian Schools",
    description:
      "Free webinars, expert panels, and wellbeing resources for Australian schools. Join the national movement for student wellbeing.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
