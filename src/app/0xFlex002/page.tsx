"use client";

import { useParams } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { switchChain, readContract } from "@wagmi/core";
import { base } from "@wagmi/core/chains";
import { Deposit } from "../../components/Deposit";
import { Withdraw } from "../../components/Withdraw";
import { config } from "@/wagmi";
import { contractABI002, contractAddress002 } from "@/config002";
import "../../styles/globals.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Transactions002 from "@/components/Transactions002";
import ProgressBar from "../../components/ProgressBar";
import FAQ from "../../components/FAQ002";

export default function ClubPage() {
  const { clubId } = useParams();
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
  const [userDeposits, setUserDeposits] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
          abi: contractABI002,
          address: contractAddress002,
          functionName: "getEffectiveBalance",
          args: [address],
        });
        setEffectiveBalance(Number(balance));

        const deposits = await readContract(config, {
          abi: contractABI002,
          address: contractAddress002,
          functionName: "balanceWithoutInterest",
          args: [address],
        });
        setUserDeposits(Number(deposits));
      } catch (error) {
        console.error(
          "Error fetching effective balance or user deposits:",
          error
        );
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
    await delay(3000); // Delay of 3 seconds
    fetchGoalInfo();
    fetchEffectiveBalance();
  };

  const handleWithdrawSuccess = async () => {
    setSuccessMessage("Withdrawal successful! 🎉");
    await delay(3000); // Delay of 3 seconds
    fetchGoalInfo();
    fetchEffectiveBalance();
  };

  const handleWithdrawError = (errorMessage: string) => {
    setErrorMessage(errorMessage);
    setTimeout(() => {
      setErrorMessage("");
    }, 5000); // Clear the error message after 5 seconds
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

  const calculateGrowthPercentage = () => {
    if (userDeposits > 0) {
      return ((effectiveBalance - userDeposits) / userDeposits) * 100;
    }
    return 0;
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
          <h2 className="text-2xl font-bold mb-2">
            Welcome to Flexclub {clubId}
          </h2>
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
        <h2 className="text-xl font-semibold mb-2">FLEXCLUB 002 {clubId}</h2>
        <div className="bg-gray-900 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-1">{goalInfo.name}</h3>
          <p className="text-sm mb-2">{goalInfo.goal}</p>
          <p className="mb-1">
            <span className="font-semibold">Target:</span>{" "}
            {formatUSDC(goalInfo.target)} USDC 🎯
          </p>
          <p className="mb-1">
            <span className="font-semibold">Pooled:</span>{" "}
            {formatUSDC(goalInfo.pooledWithInterest)} USDC 💰
          </p>
          <p className="mb-1">
            <span className="font-semibold">Members:</span> {goalInfo.flexers}{" "}
            🤝
          </p>
          <ProgressBar current={goalInfo.pooled} target={goalInfo.target} />
        </div>
      </div>

      {status === "connected" && (
        <div className="balance-section">
          <h4 className="balance-header">Flexclub 002 Balance 🤑</h4>
          <p className="font-semibold">
            {formatUSDC(effectiveBalance)} USDC (+{""}
            {calculateGrowthPercentage().toFixed(2)}%) 📈
          </p>
          <p className="text-sm mt-2">
            Your balance for this club, which includes your deposits plus
            interest earned through Aave.
          </p>
          <p className="text-sm font-semibold mt-2">
            Growth Percentage: {calculateGrowthPercentage().toFixed(2)}%
          </p>
        </div>
      )}

      {/* Donation Deposit Component (Always Visible) */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Deposit</h3>
        <p className="text-sm mb-4">
          Make a deposit to join this club. Only deposit USDC on Base.
        </p>
        <Deposit
          contractAddress={contractAddress002}
          contractABI={contractABI002}
          onDepositSuccess={handleDepositSuccess}
        />
      </div>

      {status === "connected" && (
        <>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Withdraw</h3>
            <p className="text-sm mb-4">Only withdraw USDC on Base</p>
            <Withdraw
              contractAddress={contractAddress002}
              contractABI={contractABI002}
              onWithdrawSuccess={handleWithdrawSuccess}
              onWithdrawError={handleWithdrawError}
            />
          </div>
        </>
      )}

      {successMessage && (
        <div className="mt-4 p-2 bg-green-600 text-white rounded-md">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 p-2 bg-red-600 text-white rounded-md">
          {errorMessage}
        </div>
      )}

      <Transactions002 />
      <FAQ />

      <div>
        {status !== "connected" && (
          <div className="text-center mt-8">
            <h3 className="text-lg font-medium mb-4 connect-header">
              Join Flexclub
            </h3>
            <div className="flex justify-center mt-4">
              <ConnectButton
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full",
                }}
                label="Login or Signup"
                showBalance={false}
              />
            </div>
          </div>
        )}
        {status === "connected" && (
          <div className="flex justify-center mt-8">
            <ConnectButton
              accountStatus={{
                smallScreen: "avatar",
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
