import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { ClientProviders } from "./providers";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { SignedOut as SignedOutUI } from "@/components/signed-out";
import { Footer } from "@/components/footer";
import { PWAProvider } from "@/components/pwa-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  preload: true,
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
});

export const metadata: Metadata = {
  title: "ADHD Task Manager",
  description: "Unf*ck your brain.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ADHD Task Manager",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "ADHD Task Manager",
    title: "ADHD Task Manager",
    description: "Unf*ck your brain.",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#111827",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="application-name" content="ADHD Task Manager" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="ADHD Task Manager" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="msapplication-TileColor" content="#111827" />
          <meta name="msapplication-tap-highlight" content="no" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/icons/icon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/icons/icon-16x16.png"
          />
          <link
            rel="mask-icon"
            href="/icons/icon-192x192.png"
            color="#111827"
          />
        </head>
        <body
          className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
        >
          <PWAProvider>
            <ClientProviders>
              <div className="flex flex-col min-h-screen bg-[#1c1c1c] gap-6">
                <SignedOut>
                  <SignedOutUI />
                </SignedOut>
                <SignedIn>
                  <nav className="flex justify-end items-center p-4">
                    <UserButton />
                  </nav>
                  {children}
                  <Footer />
                </SignedIn>
              </div>
            </ClientProviders>
          </PWAProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
