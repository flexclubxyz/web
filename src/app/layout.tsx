import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { type ReactNode } from "react";
import { Providers } from "./providers";
import Image from "next/image";
import logo from "../../public/logo.png";
import Footer from "@/components/Footer";

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
        <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col">
          <header className="fixed w-full top-0 bg-white dark:bg-gray-900 z-50 shadow-md p-2">
            <div className="max-w-2xl pl-16 mx-auto flex items-center space-x-2 px-4">
              <Image src={logo} alt="Flexclub Logo" width={50} height={50} />
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                Flexclub
              </span>
            </div>
          </header>
          <Providers>
            <div className="pt-14 sm:pt-4 page-container flex-grow">
              {props.children}
            </div>
          </Providers>
          <Footer />
        </div>
      </body>
    </html>
  );
}
