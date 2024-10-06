"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { writeContract } from "@wagmi/core";
import { config } from "@/wagmi";
import { parseEther } from "ethers";
import { useConnectModal } from "@rainbow-me/rainbowkit";

interface DonationDepositProps {
  contractABI: any;
  contractAddress: `0x${string}`;
  onDepositSuccess: () => void;
}

export function DonationDeposit({
  contractABI,
  contractAddress,
  onDepositSuccess,
}: DonationDepositProps) {
  const [amount, setAmount] = useState("");
  const { address, status } = useAccount();
  const { openConnectModal } = useConnectModal(); // Destructure openConnectModal
  const [loading, setLoading] = useState(false);

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (status !== "connected" || !address) {
        throw new Error("User not connected");
      }

      try {
        setLoading(true);
        // Convert amount to wei using parseEther
        const amountInWei = parseEther(amount || "0");
        // Proceed with the deposit
        const tx = await writeContract(config, {
          abi: contractABI,
          address: contractAddress,
          functionName: "deposit",
          account: address,
          args: [], // Assuming deposit takes no arguments
          value: amountInWei,
        });
        console.log("Transaction sent:", tx);
        onDepositSuccess();
      } catch (error) {
        console.error("Error during contract interaction:", error);
        alert("Failed to deposit. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleDeposit = () => {
    if (status !== "connected") {
      // Open the Connect Modal if not connected
      openConnectModal?.(); // Safely invoke if defined
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    mutate();
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
      <input
        type="number"
        min="0"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in ETH"
        className="p-2 rounded-md border border-gray-300 text-black dark:text-white bg-white dark:bg-gray-800 w-full md:w-1/2"
        disabled={loading} // Disable only when loading
      />
      <button
        onClick={handleDeposit}
        className={`p-2 rounded-md text-white w-full md:w-1/2 transition-colors duration-200 ${
          status === "connected"
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={loading} // Remove status !== "connected" from disabled
        title={
          status !== "connected"
            ? "Connect your wallet to donate ETH"
            : "Deposit ETH"
        }
      >
        {loading ? (
          <div className="loader border-t-transparent border-4 border-white rounded-full w-4 h-4 mx-auto"></div>
        ) : status === "connected" ? (
          "Donate"
        ) : (
          "Donate"
        )}
      </button>
    </div>
  );
}
