"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
// import ClubCard001 from "@/components/ClubCard001";
import ClubCard002 from "@/components/ClubCard002";
import ClubCard003 from "@/components/ClubCard003";
import ClubCard004 from "@/components/ClubCard004";

export default function HomePage() {
  const { status } = useAccount();

  return (
    <div className="max-w-lg mx-auto bg-gray-800 text-white rounded-lg shadow-md p-6 mt-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Welcome to Flexclub
      </h2>
      <p className="mb-6 text-center">
        Onchain goal-based saving clubs. The fun way to save onchain!
      </p>
      <div>
        <div className="space-y-4">
          <ClubCard002 />
          <ClubCard004 />
          <ClubCard003 />
          {/* <ClubCard001 /> */}
        </div>
        {status !== "connected" && (
          <div className="text-center mt-8">
            <h3 className="text-lg font-bold mb-4 connect-header">
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
