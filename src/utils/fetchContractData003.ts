import axios from "axios";

interface Log {
  transactionHash: string;
  blockNumber: string;
  logIndex: string;
}

export const fetchTransactions = async (
  contractAddress: string
): Promise<Log[]> => {
  const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;
  const url = `https://api.basescan.org/api?module=logs&action=getLogs&address=0x86b03BF27Bc858c77725Dd0EbeB36653C6e6d31f&fromBlock=0&toBlock=latest&apikey=${apiKey}`;
  const response = await axios.get(url);

  if (response.data.result && Array.isArray(response.data.result)) {
    // Sort the logs by block number and log index in descending order to get the latest logs first
    const sortedLogs = response.data.result.sort((a: Log, b: Log) => {
      if (parseInt(b.blockNumber, 16) !== parseInt(a.blockNumber, 16)) {
        return parseInt(b.blockNumber, 16) - parseInt(a.blockNumber, 16);
      }
      return parseInt(b.logIndex, 16) - parseInt(a.logIndex, 16);
    });

    // Filter out duplicate transactions
    const uniqueLogs = sortedLogs.filter(
      (log: Log, index: number, self: Log[]) =>
        index ===
        self.findIndex((t: Log) => t.transactionHash === log.transactionHash)
    );

    return uniqueLogs;
  } else {
    console.error("Expected an array of logs, got:", response.data.result);
    return [];
  }
};
