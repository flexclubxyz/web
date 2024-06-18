import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { type ReactNode } from "react";
import { Providers } from "./providers";
import Image from "next/image";
import logo from "../../public/logo.png";

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
        <div className="bg-white dark:bg-gray-900 min-h-screen">
          <header className="fixed w-full top-0 bg-white dark:bg-gray-900 z-50 shadow-md p-4">
            <div className="flex items-center justify-center space-x-2">
              <Image src={logo} alt="Flexclub Logo" width={50} height={50} />
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                Flexclub
              </span>
            </div>
          </header>
          <Providers>
            <div className="pt-20 sm:pt-4">{props.children}</div>{" "}
            {/* Adjust padding to accommodate the fixed header */}
          </Providers>
        </div>
      </body>
    </html>
  );
}
