import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { parseUnits } from "ethers";
import { writeContract, readContract } from "@wagmi/core";
import { config } from "@/wagmi";
import { contractABI, contractAddress, usdcABI, usdcAddress } from "../config";

export function Deposit() {
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

      // Check USDC allowance
      try {
        const allowance = await readContract(config, {
          abi: usdcABI,
          address: usdcAddress,
          functionName: "allowance",
          args: [address, contractAddress],
        });
        console.log("Allowance:", allowance);

        // Type assertion for allowance
        const allowanceBN = BigInt(allowance as string);
        console.log("Allowance as BigInt:", allowanceBN.toString());

        if (allowanceBN < amountInUnits) {
          console.log("Allowance is less than amount, approving USDC");
          // Approve USDC
          await writeContract(config, {
            abi: usdcABI,
            address: usdcAddress,
            functionName: "approve",
            args: [contractAddress, amountInUnits],
            account: address,
          });
          console.log("USDC approved");
        } else {
          console.log("Sufficient allowance, no need to approve");
        }

        // Proceed with the deposit
        console.log("Proceeding with deposit");
        await writeContract(config, {
          abi: contractABI,
          address: contractAddress,
          functionName: "deposit",
          args: [amountInUnits],
          account: address,
        });
        console.log("Deposit successful");
      } catch (error) {
        console.error("Error during contract interaction:", error);
      }
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
