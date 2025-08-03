"use client";
import React, { useEffect } from "react";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Automatically close the toast after 3 seconds
    }, 15000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [message, onClose]);

  const getTypeClasses = (type) => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "info":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div
      className={`fixed top-5 right-5 max-w-xs w-full p-4 rounded-lg z-[999] shadow-lg ${getTypeClasses(
        type
      )} transform transition-all duration-300`}
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold">{message}</span>
        <button onClick={onClose} className="text-white ml-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-6 w-6 text-white hover:text-gray-800"
          >
            <path
              fillRule="evenodd"
              d="M10 9.293l4.707-4.707a1 1 0 011.414 1.414L11.414 10l4.707 4.707a1 1 0 11-1.414 1.414L10 11.414l-4.707 4.707a1 1 0 11-1.414-1.414L8.586 10 3.879 5.293a1 1 0 111.414-1.414L10 9.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
