"use client";
import React from "react";

export default function DegreeSelect({ register, name, error }) {
  const degrees = [
    "Bachelor's",
    "Master's",
    "Doctorate (PhD)",
    "MBBS",
    "MD",
    "Fellowship",
    "Diploma",
    "Other",
  ];

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-light"
      >
        Degree Type
      </label>
      <select
        id={name}
        name={name}
        className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-primary-light"
        {...register(name)}
      >
        <option value="">Select Degree Type</option>
        {degrees.map((degree, index) => (
          <option key={index} value={degree}>
            {degree}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
