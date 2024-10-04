import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { writeContract } from "@wagmi/core";
import { config } from "@/wagmi";

export function DonationWithdraw({
  contractABI,
  contractAddress,
  onWithdrawSuccess,
}: {
  contractABI: any;
  contractAddress: `0x${string}`;
  onWithdrawSuccess: () => void;
}) {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!address) {
        return;
      }

      try {
        setLoading(true);
        // Proceed with the withdraw
        await writeContract(config, {
          abi: contractABI,
          address: contractAddress,
          functionName: "withdraw",
          account: address,
          args: [], // Include args, even if empty
        });
        onWithdrawSuccess();
      } catch (error) {
        console.error("Error during contract interaction:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <button
      onClick={() => mutate()}
      className="p-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 w-full"
      disabled={loading}
    >
      {loading ? (
        <div className="loader border-t-transparent border-4 border-white rounded-full w-4 h-4 mx-auto"></div>
      ) : (
        "Withdraw Funds"
      )}
    </button>
  );
}
