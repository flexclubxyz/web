"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { config } from "@/wagmi";
import { readContract } from "@wagmi/core";
import { contractABI002, contractAddress002 } from "@/config002";

interface GoalInfo {
  name: string;
  goal: string;
  pooled: number;
  target: number;
  flexers: number;
  pooledWithInterest: number;
}

const formatUSDC = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value / 1e6); // Convert from 6 decimal places
};

export default function ClubCard002() {
  const [goalInfo, setGoalInfo] = useState<GoalInfo>({
    name: "",
    goal: "",
    pooled: 0,
    target: 0,
    flexers: 0,
    pooledWithInterest: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchGoalInfo = async () => {
    try {
      setIsLoading(true);
      await delay(1000); // Add a delay of 1 second
      const data = await readContract(config, {
        abi: contractABI002,
        address: contractAddress002,
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
        flexers: Number(flexers),
        pooledWithInterest: Number(pooledWithInterest),
      });
    } catch (error) {
      console.error("Error fetching goal info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoalInfo();
  }, []);

  return (
    <div className="card">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3>{goalInfo.name}</h3>
          <p>{goalInfo.goal}</p>
          <p>
            <span className="font-semibold">Target:</span>{" "}
            {formatUSDC(goalInfo.target)} USDC 🎯
          </p>
          <p>
            <span className="font-semibold">Pooled:</span>{" "}
            {formatUSDC(goalInfo.pooledWithInterest)} USDC 💰
          </p>
          <p>
            <span className="font-semibold">Members:</span> {goalInfo.flexers}
          </p>
          <p>
            <span className="font-semibold">APY:</span> 6.61% 📈
          </p>
          <Link href={`/0xFlex002`} legacyBehavior>
            <a className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded">
              Join this club 🙌
            </a>
          </Link>
        </>
      )}
    </div>
  );
}