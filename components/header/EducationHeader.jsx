"use client";
import React, { useState } from "react";
import GeneralButton from "@/components/button/GeneralButton";
import Modal from "../modal/Modal";
import QualificationForm from "../form/QualificationForm";

const EducationHeader = ({
  id,
  accessToken,
  refreshCall,
  defaultState = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultState);
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
        <QualificationForm
          id={id}
          accessToken={accessToken}
          setIsOpen={setIsOpen}
          refreshCall={refreshCall}
        />
      </Modal>
    </>
  );
};

export default EducationHeader;
