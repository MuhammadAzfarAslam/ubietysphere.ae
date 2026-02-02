"use client";
import React, { useState, useRef, useEffect } from "react";
import { DOCTOR_CATEGORIES } from "@/utils/enums";

export default function CategorySelect({
  setValue,
  defaultValue,
  name = "category",
  multiple = false,
  options,
}) {
  const items = options || DOCTOR_CATEGORIES;

  // Single select state
  const [singleValue, setSingleValue] = useState(defaultValue || "");

  // Multi select state
  const [selected, setSelected] = useState(
    multiple
      ? Array.isArray(defaultValue)
        ? defaultValue
        : defaultValue
          ? [defaultValue]
          : []
      : []
  );
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Single select handler
  const handleSingleChange = (e) => {
    setSingleValue(e.target.value);
    setValue(name, e.target.value);
  };

  // Multi select handlers
  const toggleOption = (item) => {
    const updated = selected.includes(item)
      ? selected.filter((s) => s !== item)
      : [...selected, item];
    setSelected(updated);
    setValue(name, updated);
  };

  const removeTag = (item) => {
    const updated = selected.filter((s) => s !== item);
    setSelected(updated);
    setValue(name, updated);
  };

  if (!multiple) {
    return (
      <select
        id={name}
        name={name}
        value={singleValue}
        onChange={handleSingleChange}
        className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
      >
        <option value="">Select {name}</option>
        {items.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light cursor-pointer min-h-[48px]"
      >
        {selected.length === 0 ? (
          <span className="text-gray-400">Select {name}</span>
        ) : (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {selected.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-white text-sm rounded-full whitespace-nowrap flex-shrink-0"
              >
                {item}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(item);
                  }}
                  className="hover:text-red-200 ml-0.5"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-sm shadow-lg max-h-60 overflow-y-auto">
          {items.map((item) => (
            <li
              key={item}
              onClick={() => toggleOption(item)}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${
                selected.includes(item) ? "bg-primary/5 text-primary font-medium" : ""
              }`}
            >
              <span
                className={`w-4 h-4 border rounded flex-shrink-0 flex items-center justify-center ${
                  selected.includes(item) ? "bg-primary border-primary text-white" : "border-gray-300"
                }`}
              >
                {selected.includes(item) && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
