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
    <div className="input-container">
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in USDC"
      />
      <button onClick={() => mutate()}>Withdraw USDC</button>
    </div>
  );
}
