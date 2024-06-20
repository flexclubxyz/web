"use client";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function HomePage() {
  const { status } = useAccount();

  const flexclubs = [
    {
      id: "0xFlex001",
      name: "Flexclub 001",
      goal: "Save for Devcon 2024 in Bangkok",
      target: 800,
      pooled: 144.79,
      flexers: 7,
    },
    {
      id: "002",
      name: "Flexclub 002",
      goal: "Save for a group vacation",
      target: 10000,
      pooled: 7000,
      flexers: 15,
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

  return (
    <div className="max-w-lg mx-auto bg-gray-800 text-white rounded-lg shadow-md p-6 mt-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Welcome to Flexclub
      </h2>
      <p className="mb-6 text-center">
        Onchain goal-based saving clubs. The fun way to save onchain!
      </p>
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
                Join Flexclub
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
      </div>
    </div>
  );
}
