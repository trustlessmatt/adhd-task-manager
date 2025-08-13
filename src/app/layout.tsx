import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { ClientProviders } from "./providers";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { SignedOut as SignedOutUI } from "@/components/signed-out";
import { Footer } from "@/components/footer";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
        >
          <ClientProviders>
            <div className="flex flex-col min-h-screen bg-gray-900 gap-6">
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
        </body>
      </html>
    </ClerkProvider>
  );
}
