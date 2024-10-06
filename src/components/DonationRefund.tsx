import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { writeContract } from "@wagmi/core";
import { config } from "@/wagmi";

export function DonationRefund({
  contractABI,
  contractAddress,
  onRefundSuccess,
}: {
  contractABI: any;
  contractAddress: `0x${string}`;
  onRefundSuccess: () => void;
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
        // Proceed with the refund
        await writeContract(config, {
          abi: contractABI,
          address: contractAddress,
          functionName: "refund",
          account: address,
          args: [], // Include args, even if empty
        });
        onRefundSuccess();
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
      className="p-2 bg-green-600 rounded-md text-white hover:bg-green-700 w-full"
      disabled={loading}
    >
      {loading ? (
        <div className="loader border-t-transparent border-4 border-white rounded-full w-4 h-4 mx-auto"></div>
      ) : (
        "Request Refund"
      )}
    </button>
  );
}
