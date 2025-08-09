"use client";
import React from "react";
import GeneralButton from "@/components/button/GeneralButton";

const EducationHeader = ({ onAdd, title = "Education" }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      </div>
      <div>
        <GeneralButton onClick={onAdd}>Add {title}</GeneralButton>
      </div>
    </div>
  );
};

export default EducationHeader;
