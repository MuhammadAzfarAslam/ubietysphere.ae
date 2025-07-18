import Link from "next/link";
import React from "react";

const FormButton = ({ additionalClass, children, ...props }) => {
  return (
    <button
      type="submit"
      {...props}
      className={`inline-block px-6 py-3 bg-primary text-white font-medium rounded-sm shadow relative overflow-hidden group border-2 border-transparent hover:border-primary transition ${additionalClass}`}
    >
      <span className="relative z-10 group-hover:text-primary">{children}</span>
      <span className="absolute left-0 top-0 w-full h-full bg-secondary transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out"></span>
    </button>
  );
};

export default FormButton;
