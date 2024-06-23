import axios from "axios";
import { contractAddress } from "@/config";

export const fetchTransactions = async (contractAddress: string) => {
  const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;
  const contractAddress001 = contractAddress;
  const url = `https://api.basescan.org/api?module=logs&action=getLogs&address=${contractAddress001}&fromBlock=0&toBlock=latest&sort=desc&apikey=${apiKey}`;
  const response = await axios.get(url);
  console.log(response.data);
  return response.data.result;
};
