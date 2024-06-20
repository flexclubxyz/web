"use client";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { switchChain, readContract } from "@wagmi/core";
import { base } from "@wagmi/core/chains";
import { config } from "@/wagmi";
import { contractABI, contractAddress } from "@/config";

export default function HomePage() {
  const { status, address, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const [effectiveBalance, setEffectiveBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const flexclubs = [
    {
      id: "0xFlex001",
      name: "FLEXCLUB 001",
      goal: "Devcon 2024 in Bangkok 🇹🇭",
      target: 800,
      pooled: 144.79,
      flexers: 7,
    },
    {
      id: "0xFlex001",
      name: "FLEXCLUB 002",
      goal: "Farcon 2025 in Tokyo 🇯🇵",
      target: 5000,
      pooled: 8000,
      flexers: 450,
    },
  ];

  const formatUSDC = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value); // Assuming value is in USDC format already
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
    if (status === "connected") {
      fetchEffectiveBalance();
    }
  }, [status, address]);

  return (
    <div className="max-w-lg mx-auto bg-gray-800 text-white rounded-lg shadow-md p-6 mt-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Welcome to Flexclub
      </h2>
      <p className="mb-6 text-center">
        Onchain goal-based saving clubs. The fun way to save onchain!
      </p>
      {/* {status === "connected" && (
        <div className="balance-section bg-gray-900 p-4 rounded-md mb-6 text-center">
          <h4 className="balance-header">Flexclub Balance 🤑</h4>
          <p>{formatUSDC(effectiveBalance)} USDC</p>
        </div>
      )} */}
      <div>
        <div className="space-y-4">
          {flexclubs.map((club) => (
            <div key={club.id} className="card">
              <h3>{club.name}</h3>
              <p>{club.goal}</p>
              <p>
                <span className="font-semibold">Target:</span>{" "}
                {formatUSDC(club.target)} USDC 🎯
              </p>
              <p>
                <span className="font-semibold">Pooled:</span>{" "}
                {formatUSDC(club.pooled)} USDC 💰
              </p>
              <p>
                <span className="font-semibold">Members:</span> {club.flexers}{" "}
                🌀
              </p>
              <Link href={`/${club.id}`} className="link">
                Join this club
              </Link>
            </div>
          ))}
        </div>
        {status !== "connected" && (
          <div className="text-center mt-8">
            <h3 className="text-lg font-bold mb-4 connect-header">
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
