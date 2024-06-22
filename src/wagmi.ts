import { createConfig } from "wagmi";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { mainnet, base } from "viem/chains";

export const config = getDefaultConfig({
  appName: "Flexclub Rainbowkit App",
  projectId: "e67703b72e26e5b40331c85c2aebfe63",
  chains: [mainnet, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
