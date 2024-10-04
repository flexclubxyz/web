"use client";

import { useAccount, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { switchChain, readContract } from "@wagmi/core";
import { base } from "@wagmi/core/chains";
import { DonationDeposit } from "../../components/DonationDeposit";
import { DonationRefund } from "../../components/DonationRefund";
import { DonationWithdraw } from "../../components/DonationWithdraw";
import { config } from "@/wagmi";
import { contractABI003, contractAddress003 } from "@/config003";
import "../../styles/globals.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Transactions003 from "@/components/Transactions003";

export default function ClubPage() {
  const { status, address, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const [goalInfo, setGoalInfo] = useState({
    name: "",
    description: "",
    pooled: 0,
    target: 0,
    deadline: 0,
    contributors: 0,
  });
  const [userBalance, setUserBalance] = useState(0);
  const [isDonationWallet, setIsDonationWallet] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function switchToBase() {
      if (status === "connected" && chain?.id !== base.id) {
        try {
          setIsLoading(true);
          await switchChain(config, {
            chainId: base.id,
          });
        } catch (error) {
          // console.error("Failed to switch chain", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    switchToBase();
  }, [status, chain]);

  const fetchGoalInfo = async () => {
    try {
      setIsLoading(true);
      const data = await readContract(config, {
        abi: contractABI003,
        address: contractAddress003,
        functionName: "getGoalInfo",
      });

      const [name, description, pooled, target, deadline, contributors] =
        data as [string, string, number, number, number, number];

      setGoalInfo({
        name,
        description,
        pooled: Number(pooled),
        target: Number(target),
        deadline: Number(deadline),
        contributors: Number(contributors),
      });
    } catch (error) {
      // console.error("Error fetching goal info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserBalance = async () => {
    if (address) {
      try {
        setIsLoading(true);
        const balance = await readContract(config, {
          abi: contractABI003,
          address: contractAddress003,
          functionName: "balances",
          args: [address],
        });
        setUserBalance(Number(balance));

        const donationWalletAddress = await readContract(config, {
          abi: contractABI003,
          address: contractAddress003,
          functionName: "donationWallet",
        });
        setIsDonationWallet(
          address.toLowerCase() === donationWalletAddress.toLowerCase()
        );
      } catch (error) {
        // console.error("Error fetching user balance:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchGoalInfo();
    if (status === "connected") {
      fetchUserBalance();
    }
  }, [status, address]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000); // Clear the message after 3 seconds

      return () => clearTimeout(timer); // Clear the timer if the component unmounts or successMessage changes
    }
  }, [successMessage]);

  const handleDepositSuccess = async () => {
    setSuccessMessage("Deposit successful!");
    await delay(3000); // Delay of 3 seconds
    fetchGoalInfo();
    fetchUserBalance();
  };

  const handleRefundSuccess = async () => {
    setSuccessMessage("Refund successful!");
    await delay(3000); // Delay of 3 seconds
    fetchGoalInfo();
    fetchUserBalance();
  };

  const handleWithdrawSuccess = async () => {
    setSuccessMessage("Withdrawal successful!");
    await delay(3000); // Delay of 3 seconds
    fetchGoalInfo();
    fetchUserBalance();
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const formatETH = (value: number) => {
    return (value / 1e18).toFixed(4); // Convert from wei to ETH
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-800 text-white rounded-lg shadow-md p-6 mt-4">
      {isLoading && (
        <div className="flex justify-center mb-4">
          <div className="loader"></div>
        </div>
      )}
      <div>
        {status !== "connected" && (
          <h2 className="text-2xl font-bold mb-2">Welcome to Flexclub 003</h2>
        )}
        {status !== "connected" && (
          <p className="mb-4">
            Onchain goal-based donation clubs. The fun way to contribute
            onchain!
          </p>
        )}
        {status === "connected" && (
          <h2 className="text-2xl font-bold mb-2">Hi, anon 👋</h2>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Flexclub 003</h2>
        <div className="bg-gray-900 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-1">{goalInfo.name}</h3>
          <p className="text-sm mb-2">{goalInfo.description}</p>
          <p className="mb-1">
            <span className="font-semibold">Target:</span>{" "}
            {formatETH(goalInfo.target)} ETH 🎯
          </p>
          <p className="mb-1">
            <span className="font-semibold">Pooled:</span>{" "}
            {formatETH(goalInfo.pooled)} ETH 💰
          </p>
          <p className="mb-1">
            <span className="font-semibold">Contributors:</span>{" "}
            {goalInfo.contributors} 🤝
          </p>
          <p className="mb-1">
            <span className="font-semibold">Donation Recipient:</span>{" "}
            ashmoney.base.eth
          </p>
        </div>
      </div>

      {status === "connected" && (
        <div className="balance-section">
          <h4 className="balance-header">Your Contribution 💜 </h4>
          <p className="font-semibold">{formatETH(userBalance)} ETH</p>
          <p className="text-sm mt-2">Your total contributions to this club.</p>
        </div>
      )}

      {status === "connected" && (
        <>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Deposit</h3>
            <p className="text-sm mb-4">Only deposit ETH on Base</p>
            <DonationDeposit
              contractAddress={contractAddress003}
              contractABI={contractABI003}
              onDepositSuccess={handleDepositSuccess}
            />
          </div>

          {parseFloat(userBalance.toString()) > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Refund</h3>
              <p className="text-sm mb-4">
                Withdraw your deposit if funds haven't been withdrawn by the
                donation wallet
              </p>
              <DonationRefund
                contractAddress={contractAddress003}
                contractABI={contractABI003}
                onRefundSuccess={handleRefundSuccess}
              />
            </div>
          )}

          {isDonationWallet && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Withdraw Funds</h3>
              <p className="text-sm mb-4">
                Withdraw all pooled funds to the donation wallet
              </p>
              <DonationWithdraw
                contractAddress={contractAddress003}
                contractABI={contractABI003}
                onWithdrawSuccess={handleWithdrawSuccess}
              />
            </div>
          )}
        </>
      )}

      {successMessage && (
        <div className="mt-4 p-2 bg-green-600 text-white rounded-md">
          {successMessage}
        </div>
      )}

      <div className="text-center mt-4">
        <button
          className="how-it-works-button"
          onClick={() => setShowModal(true)}
        >
          How does Flexclub work? 🤔
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4 mt-4">
              How does Flexclub work?
            </h3>
            <p className="mb-4">
              Flexclub is an onchain goal-based donation club. Members
              contribute ETH into a shared pool.
            </p>
            <p className="mb-4">
              The pooled funds are used to achieve the club's goal. Members can
              refund their contributions before the funds are withdrawn by the
              donation wallet.
            </p>
            <p>
              Each club is managed by its own smart contract. No funds are held
              by Flexclub, and all accounts are fully self-custodial. You are in
              control of your contributions.
            </p>
            <div className="text-center">
              <button
                className="close-button mt-6"
                onClick={() => setShowModal(false)}
              >
                Okay, got it 👌
              </button>
            </div>
          </div>
        </div>
      )}
      <Transactions003 />
      <div>
        {status !== "connected" && (
          <div className="text-center mt-8">
            <h3 className="text-lg font-medium mb-4 connect-header">
              Join Flexclub
            </h3>
            <div className="flex justify-center mt-4">
              <ConnectButton
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full",
                }}
                label="Login or Signup"
                showBalance={false}
              />
            </div>
          </div>
        )}
        {status === "connected" && (
          <div className="flex justify-center mt-8">
            <ConnectButton
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
              showBalance={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
