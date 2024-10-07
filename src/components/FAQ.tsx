// components/FAQ.tsx

import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const faqData: FAQItem[] = [
  {
    question: "What is Flexclub?",
    answer: (
      <>
        Flexclub is an onchain goal-based savings app where members contribute
        into a shared pool to achieve collective goals.
        <br />
        <br />
        This club (Flexclub 003) specifically is a donation based club, with all
        contributions going to a recipient's wallet.
      </>
    ),
  },
  {
    question: "How can I donate?",
    answer: (
      <>
        Connect your wallet, ensure you're on the Base network, enter an amount
        and click Donate to contribute ETH to the campaign.
        <br />
        <br />
        You can also contribute by sending Base ETH directly to the smart
        contract address:{" "}
        <a
          href="https://basescan.org/address/0x86b03BF27Bc858c77725Dd0EbeB36653C6e6d31f"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          0x86b03BF27Bc858c77725Dd0EbeB36653C6e6d31f
        </a>
      </>
    ),
  },
  {
    question: "Can I get a refund?",
    answer: (
      <>
        Yes, if funds haven't been withdrawn by the donation recipient, you can
        request a refund of your contributions.
        <br />
        <br />
        The recipient is only able to withdraw funds when the target has been
        reached or when the campaign reaches its due date. The due date for this
        campaign is 21 October 2024.
      </>
    ),
  },
  // Add more FAQs as needed
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-4">Frequently Asked Questions</h3>
      <div className="space-y-2">
        {faqData.map((item, index) => (
          <div key={index} className="border-b border-gray-600 pb-2">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left flex justify-between items-center focus:outline-none"
            >
              <span className="text-md font-medium">{item.question}</span>
              <span className="ml-2">{activeIndex === index ? "-" : "+"}</span>
            </button>
            {activeIndex === index && (
              <div className="mt-2 text-sm text-gray-300">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
