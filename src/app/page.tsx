"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { switchChain, readContract } from "@wagmi/core";
import { base } from "@wagmi/core/chains";
import { Deposit } from "../components/Deposit";
import { Withdraw } from "../components/Withdraw";
import { config } from "@/wagmi";
import { contractABI, contractAddress } from "../config";

function App() {
  const { status, address, chain, connector } = useAccount();
  const { connectors, connect, error } = useConnect();
  const { disconnect } = useDisconnect();

  const [goalInfo, setGoalInfo] = useState({
    name: "",
    goal: "",
    pooled: 0,
    target: 0,
    deadline: 0,
    flexers: 0,
    pooledWithInterest: 0,
  });

  const [effectiveBalance, setEffectiveBalance] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

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

  useEffect(() => {
    const fetchGoalInfo = async () => {
      try {
        const data = await readContract(config, {
          abi: contractABI,
          address: contractAddress,
          functionName: "getGoalInfo",
        });

        const [
          name,
          goal,
          pooled,
          target,
          deadline,
          flexers,
          pooledWithInterest,
        ] = data as [string, string, number, number, number, number, number];

        setGoalInfo({
          name,
          goal,
          pooled: Number(pooled),
          target: Number(target),
          deadline: Number(deadline),
          flexers: Number(flexers),
          pooledWithInterest: Number(pooledWithInterest),
        });
      } catch (error) {
        console.error("Error fetching goal info:", error);
      }
    };

    const fetchEffectiveBalance = async () => {
      if (address) {
        try {
          const balance = await readContract(config, {
            abi: contractABI,
            address: contractAddress,
            functionName: "getEffectiveBalance",
            args: [address],
          });
          setEffectiveBalance(Number(balance));
        } catch (error) {
          console.error("Error fetching effective balance:", error);
        }
      }
    };

    fetchGoalInfo();
    if (status === "connected") {
      fetchEffectiveBalance();
    }
  }, [status, address]);

  const handleDepositSuccess = () => {
    setSuccessMessage("Deposit successful!");
  };

  const formatUSDC = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value / 1e6); // Convert from 6 decimal places
  };

  return (
    <div className="container">
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

      {status !== "connected" && (
        <div>
          <h2 className="connect-header">Connect Wallet to join Flexclub</h2>
          <div className="wallet-connect-container">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => connect({ connector })}
                type="button"
              >
                {connector.name}
              </button>
            ))}
          </div>
          <div>{error?.message}</div>
        </div>
      )}

      <div className="flexclub-section">
        <h2>FLEXCLUB #001</h2>
        <div>
          <h3>{goalInfo.name}</h3>
        </div>
        <p>{goalInfo.goal} 🇹🇭</p>
        <p>- Target: {formatUSDC(goalInfo.target)} USDC 🎯</p>
        <p>
          - Pooled by club members: {formatUSDC(goalInfo.pooledWithInterest)}{" "}
          USDC 🤑
        </p>
        <p>- Members in the club: {goalInfo.flexers} 🌀</p>
        {status === "connected" && (
          <p>- Your Flexclub balance: {formatUSDC(effectiveBalance)} USDC 💰</p>
        )}
        <p>
          - Deadline: {new Date(goalInfo.deadline * 1000).toLocaleString()} ⏰
        </p>
        <p>
          <a
            href="https://basescan.org/address/0x63be961f1a2985a4596a39db6dccfebee0feae88"
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 Flexclub smart contract on Base
          </a>
        </p>
      </div>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {status === "connected" && (
        <>
          <div>
            <h2>Deposit</h2>
            <Deposit onDepositSuccess={handleDepositSuccess} />
          </div>

          <div>
            <h2>Withdraw</h2>
            <Withdraw />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
