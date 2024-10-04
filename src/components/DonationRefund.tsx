import React, { useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

export function Refund({ contractAddress, contractABI, onRefundSuccess }) {
  const [loading, setLoading] = useState(false);

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: "refund",
  });

  const { write } = useContractWrite({
    ...config,
    onSuccess() {
      onRefundSuccess();
    },
    onError(error) {
      console.error("Error during refund:", error);
    },
  });

  const handleRefund = () => {
    setLoading(true);
    write?.();
    setLoading(false);
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleRefund}
        disabled={loading || !write}
        className="p-2 bg-red-600 rounded-md text-white w-full"
      >
        {loading ? "Processing..." : "Request Refund"}
      </button>
    </div>
  );
}
