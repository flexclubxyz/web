"use client";

import { useAccount, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { switchChain, readContract } from "@wagmi/core";
import { base } from "@wagmi/core/chains";
import { Deposit } from "../components/Deposit";
import { Withdraw } from "../components/Withdraw";
import { config } from "@/wagmi";
import { contractABI, contractAddress } from "../config";
import "../styles/globals.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function App() {
  const { status, address, chain } = useAccount();
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function switchToBase() {
      if (status === "connected" && chain?.id !== base.id) {
        try {
          setIsLoading(true);
          await switchChain(config, {
            chainId: base.id,
          });
        } catch (error) {
          console.error("Failed to switch chain", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    switchToBase();
  }, [status, chain]);

  const fetchGoalInfo = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEffectiveBalance = async () => {
    if (address) {
      try {
        setIsLoading(true);
        const balance = await readContract(config, {
          abi: contractABI,
          address: contractAddress,
          functionName: "getEffectiveBalance",
          args: [address],
        });
        setEffectiveBalance(Number(balance));
      } catch (error) {
        console.error("Error fetching effective balance:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
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

  const handleDepositSuccess = async () => {
    setSuccessMessage("Deposit successful! 🎉");
    await delay(3000); // Delay of 2 seconds
    fetchGoalInfo();
    fetchEffectiveBalance();
  };

  const handleWithdrawSuccess = async () => {
    setSuccessMessage("Withdrawal successful! 🎉");
    await delay(3000); // Delay of 2 seconds
    fetchGoalInfo();
    fetchEffectiveBalance();
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const formatUSDC = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value / 1e6); // Convert from 6 decimal places
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-800 text-white rounded-lg shadow-md p-6 mt-4">
      {isLoading && (
        <div className="flex justify-center mb-4">
          <div className="loader"></div>
        </div>
      )}
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
          <h2 className="text-2xl font-bold mb-2">hi, anon 👋 </h2>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">FLEXCLUB 001</h2>
        <div className="bg-gray-900 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-1">Devcon Bangkok Trip</h3>
          <p className="text-sm mb-2">
            Save to attend Devcon 2024 in Bangkok 🇹🇭
          </p>
          <p className="mb-1">
            <span className="font-semibold">Target:</span>{" "}
            {formatUSDC(goalInfo.target)} USDC 🎯
          </p>
          <p className="mb-1">
            <span className="font-semibold">Pooled by members:</span>{" "}
            {formatUSDC(goalInfo.pooledWithInterest)} USDC 💰
          </p>
          <p className="mb-1">
            <span className="font-semibold">Members in the club:</span>{" "}
            {goalInfo.flexers} 🌀
          </p>
        </div>
      </div>

      {status === "connected" && (
        <div className="balance-section">
          <h4 className="balance-header">Flexclub Balance 🤑</h4>
          <p>{formatUSDC(effectiveBalance)} USDC</p>
        </div>
      )}

      {successMessage && (
        <div className="mt-4 p-2 bg-green-600 text-white rounded-md">
          {successMessage}
        </div>
      )}

      {status === "connected" && (
        <>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">
              DEPOSIT: Only deposit USDC on Base
            </h3>
            <Deposit onDepositSuccess={handleDepositSuccess} />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">
              WITHDRAW: Only withdraw USDC on Base
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
          <div className="text-center mt-8">
            <h3 className="text-lg font-medium mb-4 connect-header">
              Join Flexclub
            </h3>
            <div className="flex justify-center mt-4">
              <ConnectButton
                accountStatus={{
                  smallScreen: "full",
                  largeScreen: "full",
                }}
                label="Connect Wallet"
                showBalance={false}
              />
            </div>
          </div>
        )}
        {status === "connected" && (
          <div className="flex justify-center mt-8">
            <ConnectButton
              accountStatus={{
                smallScreen: "full",
                largeScreen: "full",
              }}
              showBalance={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
