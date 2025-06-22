'use client';
import { useState } from "react";

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center py-4 cursor-pointer"
      >
        <span className="text-2xl mr-4 text-blue-500">{isOpen ? "−" : "+"}</span>
        <h3 className="text-lg font-semibold">{question}</h3>
      </div>
      {isOpen && <p className="text-gray-600 pb-6 text-left pl-8">{answer}</p>}
    </div>
  );
};


export default FaqItem;
