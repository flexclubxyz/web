import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "viem/chains";

const projectId = process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID || "";

export const config = getDefaultConfig({
  appName: "Flexclub Rainbowkit App",
  projectId: projectId,
  chains: [base],
  ssr: true,
});
