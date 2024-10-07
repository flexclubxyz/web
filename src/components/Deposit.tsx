import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { parseUnits } from "ethers";
import { writeContract, readContract } from "@wagmi/core";
import { config } from "@/wagmi";
import { usdcABI, usdcAddress } from "@/config";
import { Modal } from "../components/Modal";
import { useConnectModal } from "@rainbow-me/rainbowkit";

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
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { openConnectModal } = useConnectModal();

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!isConnected || !address) {
        // User is not connected; do not proceed
        return;
      }

      setShowModal(false);

      const amountInUnits = parseUnits(amount, 6); // Convert amount to USDC (6 decimals)

      try {
        setLoading(true);
        const allowance = await readContract(config, {
          abi: usdcABI,
          address: usdcAddress,
          functionName: "allowance",
          args: [address, contractAddress],
        });

        const allowanceBN = BigInt(allowance as string);

        if (allowanceBN < amountInUnits) {
          // Approve USDC
          await writeContract(config, {
            abi: usdcABI,
            address: usdcAddress,
            functionName: "approve",
            args: [contractAddress, amountInUnits],
            account: address,
          });
        }

        // Proceed with the deposit
        await writeContract(config, {
          abi: contractABI,
          address: contractAddress,
          functionName: "deposit",
          args: [amountInUnits],
          account: address,
        });

        onDepositSuccess();
      } catch (error) {
        console.error("Error during contract interaction:", error);
        // Optionally, you can set an error message state here
      } finally {
        setLoading(false);
      }
    },
  });

  const handleDepositClick = () => {
    if (!isConnected) {
      // Open the Rainbow Connect modal
      openConnectModal?.();
    } else {
      // Show the deposit modal
      setShowModal(true);
    }
  };

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
        onClick={handleDepositClick} // Updated to handleDepositClick
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
