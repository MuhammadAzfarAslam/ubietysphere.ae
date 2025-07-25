"use client";
import React from "react";

const categories = [
  "Physician",
  "Second Opinion",
  "Genetic Counseling",
  "Lifestyle Coaching",
  "Nutrition & Dietetics",
  "Holistic Wellbeing",
  "Women's Health"
];

export default function CategorySelect({ register, defaultValue }) {
  return (
    <select
      id="category"
      name="category"
      defaultValue={defaultValue}
      className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
      {...register("category")}
    >
      <option value="">Select Category</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}
