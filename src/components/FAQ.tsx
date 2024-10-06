import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is Flexclub?",
    answer:
      "Flexclub is an onchain goal-based savings app where members contribute into a shared pool to achieve collective goals. This club (Flexclub 003) specifially is a donation based club, with all contributions going to a recipient's wallet.",
  },
  {
    question: "How can I donate?",
    answer:
      "Connect your wallet, ensure you're on the Base network, enter an amount and click Donate to contribute ETH to the campaign.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Yes, if funds haven't been withdrawn by the donation recipient, you can request a refund of your contributions.",
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
