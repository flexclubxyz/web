import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { type ReactNode } from "react";
import { Providers } from "./providers";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo.png";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flexclub",
  description: "Onchain goal based saving clubs",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-white dark:bg-gray-900`}>
        <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col items-center">
          <header className="fixed w-full max-w-md top-0 bg-white dark:bg-gray-900 z-50 shadow-md p-2">
            <div className="flex items-center space-x-2 px-4">
              <Link href="/" legacyBehavior>
                <a className="flex items-center space-x-2">
                  <Image
                    src={logo}
                    alt="Flexclub Logo"
                    width={50}
                    height={50}
                  />
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">
                    Flexclub
                  </span>
                </a>
              </Link>
            </div>
          </header>
          <div className="w-full max-w-md flex-grow">
            <Providers>
              <div className="pt-14 sm:pt-4 flex-grow">{props.children}</div>
            </Providers>
            <Footer />
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
