import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { parseUnits } from "ethers";
import { writeContract } from "@wagmi/core";
import { config } from "@/wagmi";
import { contractABI, contractAddress } from "../config";

export function Deposit() {
  const [amount, setAmount] = useState("");
  const { address } = useAccount();

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!address) return;
      const amountInUnits = parseUnits(amount, 6); // Convert amount to USDC (6 decimals)

      await writeContract(config, {
        abi: contractABI,
        address: contractAddress,
        functionName: "deposit",
        args: [amountInUnits],
        account: address,
      });
    },
  });

  return (
    <div>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in USDC"
      />
      <button onClick={() => mutate()}>Deposit USDC</button>
    </div>
  );
}
