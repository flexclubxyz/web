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
  deadline: number;
}

const formatUSDC = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value / 1e6); // Convert from 6 decimal places
};

const ClubCard002: React.FC = () => {
  const [goalInfo, setGoalInfo] = useState<GoalInfo>({
    name: "",
    goal: "",
    pooled: 0,
    target: 0,
    flexers: 0,
    pooledWithInterest: 0,
    deadline: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchGoalInfo = async () => {
    try {
      setIsLoading(true);
      await delay(1000); // Add a delay of 1 second (optional)
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
        deadline: Number(deadline),
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

  // Calculate progress percentage
  const progressPercentage = goalInfo.target
    ? Math.min((goalInfo.pooled / goalInfo.target) * 100, 100)
    : 0;

  // Calculate time left until deadline
  useEffect(() => {
    if (goalInfo.deadline === 0) return;

    const deadlineDate = new Date(goalInfo.deadline * 1000);
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = deadlineDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("Goal reached!");
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [goalInfo.deadline]);

  return (
    <div className="card bg-gray-800 text-white rounded-lg shadow-md p-6">
      {isLoading ? (
        <div className="flex justify-center">
          <div className="loader border-t-transparent border-4 border-white rounded-full w-4 h-4 mx-auto"></div>
        </div>
      ) : (
        <>
          <h3 className="text-2xl font-bold mb-2">{goalInfo.name}</h3>
          <p className="mb-4">{goalInfo.goal}</p>
          <p className="mb-1">
            <span className="font-semibold">Target:</span>{" "}
            {formatUSDC(goalInfo.target)} USDC 🎯
          </p>
          <p className="mb-1">
            <span className="font-semibold">Pooled:</span>{" "}
            {formatUSDC(goalInfo.pooledWithInterest)} USDC 💰
          </p>
          {/* Integrate ProgressBar here */}
          {/* {goalInfo.deadline > 0 && (
            <p className="mb-1">
              <span className="font-semibold">Time Left:</span> {timeLeft} ⏳
            </p>
          )} */}
          <p className="mb-1">
            <span className="font-semibold">Members:</span> {goalInfo.flexers}{" "}
            🤝
          </p>
          <p className="mb-1">
            <span className="font-semibold">APY:</span> 4.41% 📈
          </p>
          <div className="flex justify-center">
            <Link href={`/0xFlex002`} legacyBehavior>
              <a className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                Join this club ✅
              </a>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ClubCard002;
