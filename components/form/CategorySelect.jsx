"use client";
import React from "react";
import { DOCTOR_CATEGORIES } from "@/utils/enums";

export default function CategorySelect({ register, defaultValue, name= "category" }) {
  return (
    <select
      id={name}
      name={name}
      defaultValue={defaultValue}
      className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
      {...register(name)}
    >
      <option value="">Select {name}</option>
      {DOCTOR_CATEGORIES.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}
