"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { config } from "@/wagmi";
import { readContract } from "@wagmi/core";
import { contractABI003, contractAddress003 } from "@/config003";

interface GoalInfo {
  name: string;
  description: string;
  pooled: number;
  target: number;
  deadline: number;
  contributors: number;
}

const formatETH = (value: number) => {
  return (value / 1e18).toFixed(4); // Convert from wei to ETH with 4 decimal places
};

const ClubCard003: React.FC = () => {
  const [goalInfo, setGoalInfo] = useState<GoalInfo>({
    name: "",
    description: "",
    pooled: 0,
    target: 0,
    deadline: 0,
    contributors: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchGoalInfo = async () => {
    try {
      setIsLoading(true);
      await delay(1000); // Add a delay of 1 second (optional)
      const data = await readContract(config, {
        abi: contractABI003,
        address: contractAddress003,
        functionName: "getGoalInfo",
      });

      const [name, description, pooled, target, deadline, contributors] =
        data as [string, string, number, number, number, number];

      setGoalInfo({
        name,
        description,
        pooled: Number(pooled),
        target: Number(target),
        deadline: Number(deadline),
        contributors: Number(contributors),
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

  return (
    <div className="card bg-gray-800 text-white rounded-lg shadow-md p-6">
      {isLoading ? (
        <div className="flex justify-center">
          <div className="loader border-t-transparent border-4 border-white rounded-full w-8 h-8"></div>
        </div>
      ) : (
        <>
          <h3 className="text-2xl font-bold mb-2">{goalInfo.name}</h3>
          <p className="mb-4">{goalInfo.description}</p>
          <p className="mb-1">
            <span className="font-semibold">Goal Target:</span>{" "}
            {formatETH(goalInfo.target)} ETH 🎯
          </p>
          <p className="mb-1">
            <span className="font-semibold">Total Raised:</span>{" "}
            {formatETH(goalInfo.pooled)} ETH 💰
          </p>
          {/* Integrate ProgressBar here */}
          <p className="mb-1">
            <span className="font-semibold">Contributors:</span>{" "}
            {goalInfo.contributors} 🤝
          </p>
          {/* <p className="mb-4">
            <span className="font-semibold">Deadline:</span>{" "}
            {new Date(goalInfo.deadline * 1000).toLocaleDateString()} 📅
          </p> */}
          <div className="flex justify-center">
            <Link href={`/0xFlex003`} legacyBehavior>
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

export default ClubCard003;
