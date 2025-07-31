"use client";
import EducationHeader from "@/components/header/EducationHeader";
import EditDeleteList from "@/components/list/EditDeleteList";
import React from "react";

const Education = () => {
  return (
    <div className="space-y-6">
      <EducationHeader />
      <EditDeleteList />
      <EditDeleteList />
    </div>
  );
};

export default Education;
