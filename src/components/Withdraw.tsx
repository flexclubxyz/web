import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { parseUnits } from "ethers";
import { writeContract } from "@wagmi/core";
import { config } from "@/wagmi";
import { contractABI, contractAddress } from "../config";

export function Withdraw({
  onWithdrawSuccess,
}: {
  onWithdrawSuccess: () => void;
}) {
  const [amount, setAmount] = useState("");
  const { address } = useAccount();

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!address) {
        console.log("No address found");
        return;
      }

      console.log("Address:", address);
      const amountInUnits = parseUnits(amount, 6); // Convert amount to USDC (6 decimals)
      console.log("Amount in units:", amountInUnits.toString());

      // Proceed with the withdrawal
      try {
        await writeContract(config, {
          abi: contractABI,
          address: contractAddress,
          functionName: "withdraw",
          args: [amountInUnits],
          account: address,
        });
        console.log("Withdrawal successful");
        onWithdrawSuccess(); // Call the success callback
      } catch (error) {
        console.error("Error during contract interaction:", error);
      }
    },
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in USDC"
        className="p-2 rounded-md border border-gray-300 w-full md:w-auto"
      />
      <button
        onClick={() => mutate()}
        className="p-2 bg-blue-600 rounded-md text-white hover:bg-blue-700"
      >
        Withdraw USDC
      </button>
    </div>
  );
}
