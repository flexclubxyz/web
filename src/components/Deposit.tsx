import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { parseUnits } from "ethers";
import { writeContract, readContract } from "@wagmi/core";
import { config } from "@/wagmi";
import { usdcABI, usdcAddress } from "@/config";
import { Modal } from "../components/Modal"; // Import the modal component

export function Deposit({
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
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!address) {
        console.log("No address found");
        return;
      }

      setShowModal(false); // Close modal when mutation starts

      console.log("Address:", address);
      const amountInUnits = parseUnits(amount, 6); // Convert amount to USDC (6 decimals)
      console.log("Amount in units:", amountInUnits.toString());

      // Check USDC allowance
      try {
        setLoading(true);
        const allowance = await readContract(config, {
          abi: usdcABI, // usdcABI is now properly imported
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
            abi: usdcABI, // usdcABI is now properly imported
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
        placeholder="Amount in USDC"
        className="p-2 rounded-md border border-gray-300 text-black dark:text-white bg-white dark:bg-gray-800 w-full md:w-1/2"
      />
      <button
        onClick={() => setShowModal(true)} // Show modal when button is clicked
        className="p-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 w-full md:w-1/2"
        disabled={loading}
      >
        {loading ? (
          <div className="loader border-t-transparent border-4 border-white rounded-full w-4 h-4 mx-auto"></div>
        ) : (
          "Deposit USDC"
        )}
      </button>

      {/* Modal explaining the 2-step process */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-xl font-bold mb-4">Two-Step Deposit Process</h2>
        <p className="mb-4">
          To deposit USDC, you'll first need to approve the contract to spend
          your USDC. Once approved, you can proceed with the deposit.
        </p>
        <p className="mb-4">
          If you approve an amount that's higher than the deposit amount, you
          can make multiple deposits with one approval.
        </p>
        <p className="mb-4">
          Wallets like Rainbow will automatically initiate the deposit after the
          approval step. However, with wallets like Metamask, you will need to
          manually click the deposit button again after approving.
        </p>
        <button
          className="p-2 bg-blue-600 rounded-md text-white hover:bg-blue-700"
          onClick={() => mutate()} // Trigger mutation to start the process
        >
          Okay, let's proceed 👌
        </button>
      </Modal>
    </div>
  );
}
