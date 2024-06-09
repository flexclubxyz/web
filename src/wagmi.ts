import { http, createConfig } from "wagmi";
import { mainnet, sepolia, base } from "@wagmi/core/chains";
// import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, sepolia, base],
  connectors: [
    // injected(),
    // coinbaseWallet({ appName: "Create Wagmi" }),
    // walletConnect({ projectId, String: process.env.NEXT_PUBLIC_WC_PROJECT_ID }),
  ],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
