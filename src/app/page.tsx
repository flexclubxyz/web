"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { switchChain, readContract } from "@wagmi/core";
import { base } from "@wagmi/core/chains";
import { Deposit } from "../components/Deposit";
import { Withdraw } from "../components/Withdraw";
import { config } from "@/wagmi";
import { contractABI, contractAddress } from "../config";
import "../styles/globals.css";

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

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000); // Clear the message after 3 seconds

      return () => clearTimeout(timer); // Clear the timer if the component unmounts or successMessage changes
    }
  }, [successMessage]);

  const handleDepositSuccess = () => {
    setSuccessMessage("Deposit successful! 🎉");
  };

  const handleWithdrawSuccess = () => {
    setSuccessMessage("Withdrawal successful! 🎉");
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
    <div className="max-w-lg mx-auto bg-gray-800 text-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <img src="/logo.png" alt="Flexclub logo" className="h-10" />
        <h1 className="text-2xl font-bold">Flexclub</h1>
      </div>
      <div>
        {status !== "connected" && (
          <h2 className="text-2xl font-bold mb-2">Welcome to Flexclub</h2>
        )}
        {status !== "connected" && (
          <p className="mb-4">
            Onchain goal based saving clubs. The fun way to save onchain!
          </p>
        )}
        {status === "connected" && (
          <h2 className="text-2xl font-bold mb-2">Welcome back to Flexclub</h2>
        )}
      </div>

      <div className="mt-6 bg-gray-900 p-4 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-2">FLEXCLUB 001</h2>
        <div>
          <h3 className="text-lg font-medium mb-1">Devcon Bangkok Trip</h3>
        </div>
        <p className="text-gray-400 mb-2">
          Saving to attend Devcon 2024 in Bangkok 🇹🇭
        </p>
        <div className="space-y-1">
          <p>
            <span className="font-semibold">Target:</span>{" "}
            {formatUSDC(goalInfo.target)} USDC 🎯
          </p>
          <p>
            <span className="font-semibold">Pooled by members:</span>{" "}
            {formatUSDC(goalInfo.pooledWithInterest)} USDC 🤑
          </p>
          <p>
            <span className="font-semibold">Members in the club:</span>{" "}
            {goalInfo.flexers} 🌀
          </p>
        </div>
        {status === "connected" && (
          <h4 className="text-lg font-medium mt-2">
            Your Flexclub balance: {formatUSDC(effectiveBalance)} USDC 💰
          </h4>
        )}
      </div>

      {successMessage && (
        <div className="mt-4 p-2 bg-green-600 text-white rounded-md">
          {successMessage}
        </div>
      )}

      {status === "connected" && (
        <>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">
              DEPOSIT (Only make USDC deposits on Base)
            </h3>
            <Deposit onDepositSuccess={handleDepositSuccess} />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">
              WITHDRAW (Only withdraw to Base USDC wallets)
            </h3>
            <Withdraw onWithdrawSuccess={handleWithdrawSuccess} />
          </div>

          <p className="mt-4">
            <a
              href="https://basescan.org/address/0x63be961f1a2985a4596a39db6dccfebee0feae88"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Flexclub smart contract on Base
            </a>
          </p>
        </>
      )}
      <div>
        {status !== "connected" && (
          <div>
            <h3 className="text-lg font-medium mb-2 connect-header">
              Connect wallet to join Flexclub ⬇️ ⬇️ ⬇️
            </h3>
            <div className="wallet-connect-container space-y-2">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  type="button"
                  className="w-full p-2 bg-blue-600 rounded-md text-white hover:bg-blue-700"
                >
                  {connector.name}
                </button>
              ))}
            </div>
            <div className="text-red-500 mt-2">{error?.message}</div>
          </div>
        )}
      </div>
      <div className="mt-4">
        {status === "connected" && (
          <button
            type="button"
            onClick={() => disconnect()}
            className="w-full p-2 bg-red-600 rounded-md text-white hover:bg-red-700"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
