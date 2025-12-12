import type { Metadata } from "next";
import { Inter, Merriweather, JetBrains_Mono, Noto_Serif_Ethiopic } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/auth-context";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ["latin"],
  variable: '--font-merriweather',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-jetbrains',
});

const notoSerifEthiopic = Noto_Serif_Ethiopic({
  weight: ['400', '700', '900'],
  subsets: ["latin"],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: {
    default: "UdyomX ORG - Professional Web Development & Automation Services",
    template: "%s"
  },
  description: "UdyomX ORG provides professional web development, automation solutions, and digital services. Built by Mokammel Morshed.",
  keywords: ["UdyomX", "web development", "automation", "Next.js", "React", "Supabase", "n8n", "Mokammel Morshed"],
  authors: [{ name: "Mokammel Morshed", url: "https://meheran-portfolio.vercel.app" }],
  creator: "Mokammel Morshed",
  publisher: "UdyomX ORG",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  metadataBase: new URL("https://udyomxorg-69esaxc6y-mokammel-morsheds-projects.vercel.app"),
  verification: {
    google: "YrHP8OmUd-mw2VtuRqXlV8jz0pRQ-IveTL1XbmCbpt4",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://udyomxorg.vercel.app",
    siteName: "UdyomX ORG",
    title: "UdyomX ORG - Professional Web Development & Automation Services",
    description: "Professional web development, automation solutions, and digital services by Mokammel Morshed.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UdyomX ORG",
    description: "Professional web development & automation services",
    creator: "@Meheran_3005",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable} ${jetbrainsMono.variable} ${notoSerifEthiopic.variable}`}>
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-LCLVCLWZ9R"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LCLVCLWZ9R');
            `,
          }}
        />
      </head>
      <body className="bg-earth-cream text-text-primary antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

