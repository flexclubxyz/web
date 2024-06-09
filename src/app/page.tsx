"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect } from "react";
import { switchChain } from "@wagmi/core";
import { base } from "@wagmi/core/chains";
import { Deposit } from "../components/Deposit";
import { config } from "@/wagmi";

function App() {
  const { status, address, chain, connector } = useAccount();
  const { connectors, connect, error } = useConnect();
  const { disconnect } = useDisconnect();

  // Switch to Base network if not already connected
  useEffect(() => {
    async function switchToBase() {
      if (status === "connected" && chain?.id !== base.id) {
        try {
          await switchChain(config, {
            chainId: base.id,
            connector,
          });
        } catch (error) {
          console.error("Failed to switch chain", error);
        }
      }
    }
    switchToBase();
  }, [status, chain, connector]);

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {status}
          <br />
          address: {address}
        </div>

        {status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{error?.message}</div>
      </div>

      {status === "connected" && (
        <div>
          <h2>Deposit</h2>
          <Deposit />
        </div>
      )}
    </>
  );
}

export default App;
