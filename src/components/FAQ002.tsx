// components/FAQ002.tsx

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
        Flexclub is an onchain goal-based saving club. Members deposit USDC into
        a shared pool and earn interest through Aave.
        <br />
        <br />
        The pooled funds are used to achieve the club's goal, and members can
        withdraw their share of the pooled funds plus earned interest at any
        time.
        <br />
        <br />
        Each club is managed by its own smart contract. No funds are held by
        Flexclub and all accounts are fully self-custodial.
        <br />
        You are in full control of your money and can withdraw at any point.
      </>
    ),
  },
  {
    question: "How can I deposit?",
    answer:
      "Click the Login or Signup button to join Flexclub. Ensure you're on the Base network, enter an amount, and click the Deposit to start saving towards the club's goal.",
  },
  {
    question: "Can I withdraw my funds?",
    answer: (
      <>
        Yes, you can withdraw your funds at any time using the Flexclub app, or
        directly from the blockchain using a block explorer like{" "}
        <a
          href="https://basescan.org/address/0xcE51BE974FBE7e642072cAdb87F3F63b80cD7c8E"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Basescan.
        </a>
        <br />
        <br />
        No funds are held by Flexclub and all accounts are fully self-custodial.
        You are in full control of your money and can withdraw at any point.
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
              aria-expanded={activeIndex === index}
            >
              <span className="text-md font-medium">{item.question}</span>
              <span className="ml-2">{activeIndex === index ? "-" : "+"}</span>
            </button>
            {activeIndex === index && (
              <div className="mt-2 text-sm text-gray-300 transition-all duration-300 ease-in-out">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
