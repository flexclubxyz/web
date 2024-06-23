import axios from "axios";

export const fetchTransactions = async (contractAddress: string) => {
  const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;
  const url = `https://api.basescan.org/api?module=logs&action=getLogs&address=0xcE51BE974FBE7e642072cAdb87F3F63b80cD7c8E&fromBlock=0&toBlock=latest&sort=desc&apikey=${apiKey}`;
  const response = await axios.get(url);
  console.log(response.data);
  return response.data.result;
};
