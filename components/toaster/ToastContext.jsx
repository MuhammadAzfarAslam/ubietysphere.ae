"use client";
import React, { createContext, useState, useContext } from "react";
import Toast from "./Toast";

// Create a Context for Toasts
const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext); // Custom hook to access the context
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const newToast = { message, type, id: Date.now() };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Remove the toast after 3 seconds
    setTimeout(() => {
      setToasts((prevToasts) =>
        prevToasts.filter((toast) => toast.id !== newToast.id)
      );
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-0 right-0 z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() =>
              setToasts((prevToasts) =>
                prevToasts.filter((t) => t.id !== toast.id)
              )
            }
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
