"use client";
import React, { useState } from "react";
import GeneralButton from "@/components/button/GeneralButton";
import Modal from "../modal/Modal";
import QualificationForm from "../form/QualificationForm";

const EducationHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Education</h2>
        </div>
        <div className="">
          <GeneralButton onClick={() => setIsOpen(true)}>
            Add Education
          </GeneralButton>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add Qualification"
      >
        <QualificationForm />
      </Modal>
    </>
  );
};

export default EducationHeader;
