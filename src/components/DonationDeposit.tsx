import React, { useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ethers } from "ethers";

export function DonationDeposit({
  contractAddress,
  contractABI,
  onDepositSuccess,
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: "deposit",
    overrides: {
      value: ethers.utils.parseEther(amount || "0"),
    },
  });

  const { write } = useContractWrite({
    ...config,
    onSuccess() {
      onDepositSuccess();
    },
    onError(error) {
      console.error("Error during deposit:", error);
    },
  });

  const handleDeposit = () => {
    setLoading(true);
    write?.();
    setLoading(false);
  };

  return (
    <div className="mt-4">
      <input
        type="text"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="p-2 rounded-md border border-gray-300 text-black w-full"
      />
      <button
        onClick={handleDeposit}
        disabled={loading || !write}
        className="mt-2 p-2 bg-blue-600 rounded-md text-white w-full"
      >
        {loading ? "Processing..." : "Deposit ETH"}
      </button>
    </div>
  );
}
