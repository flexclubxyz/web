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
          <div className="flex justify-start p-6">
            <div className="flex items-center space-x-2">
              <Image src={logo} alt="Flexclub Logo" width={50} height={50} />
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                Flexclub
              </span>
            </div>
          </div>
          <Providers>{props.children}</Providers>
        </div>
      </body>
    </html>
  );
}
