import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "",
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
