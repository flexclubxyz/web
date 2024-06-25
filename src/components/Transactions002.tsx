import { useEffect, useState } from "react";
import { fetchTransactions } from "../utils/fetchContractData002";
import { contractAddress002 } from "@/config002";
import Link from "next/link";

interface Log {
  transactionHash: string;
  blockNumber: string;
}

export default function Transactions002() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLogs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const logs = await fetchTransactions(contractAddress002);
        console.log(logs); // Log the logs
        if (Array.isArray(logs)) {
          setLogs(logs);
        } else {
          console.error("Expected an array of logs, got:", logs);
          setError("Expected an array of logs");
        }
      } catch (error: any) {
        console.error("Error fetching logs:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getLogs();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl text-center font-bold mb-4">
        Latest transactions ✨
      </h2>
      {isLoading ? (
        <div className="loader"></div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="space-y-4">
          {logs.slice(0, 2).map((log) => (
            <div
              key={log.transactionHash}
              className="p-6 bg-gray-700 text-gray-100 rounded-lg shadow-lg border border-gray-600"
            >
              <p className="mb-2">
                <strong>Transaction Hash:</strong>{" "}
                <a
                  href={`https://basescan.org/tx/${log.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline break-all"
                >
                  {log.transactionHash}
                </a>
              </p>
              <p>
                <strong>Block Number:</strong> {parseInt(log.blockNumber, 16)}
              </p>
            </div>
          ))}
          {logs.length > 3 && (
            <div className="text-center mt-4">
              <a
                className="text-blue-400 underline"
                href="https://basescan.org/address/0xcE51BE974FBE7e642072cAdb87F3F63b80cD7c8E"
                target="_blank"
                rel="noopener noreferrer"
              >
                View More Transactions
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
