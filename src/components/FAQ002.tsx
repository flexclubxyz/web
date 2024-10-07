import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is Flexclub?",
    answer:
      "Flexclub is an onchain goal-based saving club. Members deposit USDC into a shared pool and earn interest through Aave. The pooled funds are used to achieve the club's goal, and members can withdraw their share of the pooled funds plus earned interest at any time. Each club is managed by its own smart contract. No funds are held by Flexclub and all accounts are fully self-custodial. You are in full control of your money and can withdraw at any point.",
  },
  {
    question: "How can I deposit?",
    answer:
      "Click Login or Signup button to join Flexclub. Ensure you're on the Base network, enter an amount and click Deposit USDC button to start saving towards the goal of the club.",
  },
  {
    question: "Can I withdraw my funds?",
    answer:
      "Yes, you can withdraw your funds at any time using the Flexclub app or directly from the blockchain using a block explorer like Etherscan. No funds are held by Flexclub and all accounts are fully self-custodial. You are in full control of your money and can withdraw at any point.",
  },
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
              <span>{activeIndex === index ? "-" : "+"}</span>
            </button>
            {activeIndex === index && (
              <p className="mt-2 text-sm text-gray-300">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
