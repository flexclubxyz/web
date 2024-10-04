import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { writeContract } from "@wagmi/core";
import { config } from "@/wagmi";
import { parseEther } from "ethers";

export function DonationDeposit({
  contractABI,
  contractAddress,
  onDepositSuccess,
}: {
  contractABI: any;
  contractAddress: `0x${string}`;
  onDepositSuccess: () => void;
}) {
  const [amount, setAmount] = useState("");
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!address) {
        return;
      }

      try {
        setLoading(true);
        // Convert amount to wei using parseEther from ethers v6
        const amountInWei = parseEther(amount || "0");
        // Proceed with the deposit
        await writeContract(config, {
          abi: contractABI,
          address: contractAddress,
          functionName: "deposit",
          account: address,
          args: [],
          value: amountInWei, // Pass value directly, not under overrides
        });
        onDepositSuccess();
      } catch (error) {
        console.error("Error during contract interaction:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in ETH"
        className="p-2 rounded-md border border-gray-300 text-black dark:text-white bg-white dark:bg-gray-800 w-full md:w-1/2"
      />
      <button
        onClick={() => mutate()}
        className="p-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 w-full md:w-1/2"
        disabled={loading}
      >
        {loading ? (
          <div className="loader border-t-transparent border-4 border-white rounded-full w-4 h-4 mx-auto"></div>
        ) : (
          "Deposit ETH"
        )}
      </button>
    </div>
  );
}
