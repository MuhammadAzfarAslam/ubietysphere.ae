"use client";
import React, { useState } from "react";
import EducationHeader from "@/components/header/EducationHeader";
import Modal from "@/components/modal/Modal";
import { useToast } from "@/components/toaster/ToastContext";
import getData, { postData } from "@/utils/getData";
import EditDeleteLicense from "@/components/list/EditDeleteLicense";
import LicenseForm from "@/components/form/LicenseForm";

const License = ({ data, id, accessToken }) => {
  const { addToast } = useToast();
  const [content, setContent] = useState(data?.content);

  // For Add/Edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const refreshCall = async () => {
    const res = await getData("user/licences", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setContent(res?.data?.content);
  };

  const deleteHandler = async (id) => {
    try {
      const response = await postData(
        `user/licences/${id}`,
        null,
        {
          Authorization: `Bearer ${accessToken}`,
        },
        "DELETE"
      );
      await refreshCall();
      addToast("Qualification has been deleted!", "success");
    } catch (error) {
      console.error("Update failed:", error);
      addToast("Something went wrong!", "error");
    }
  };

  const editHandler = (id) => {
    const recordToEdit = content.find((item) => item.id === id);
    setEditData(recordToEdit);
    setIsModalOpen(true);
  };

  const addHandler = () => {
    setEditData(null); // Clear form for adding
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <EducationHeader onAdd={addHandler} title="License" />
      {content?.map((item) => (
        <EditDeleteLicense
          key={item?.id}
          id={item?.id} 
          title={item?.specialization}
          authority={item?.authority}
          deleteHandler={deleteHandler}
          editHandler={editHandler}
        />
      ))}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editData ? "Edit Qualification" : "Add Qualification"}
      >
        <LicenseForm
          id={id}
          accessToken={accessToken}
          setIsOpen={setIsModalOpen}
          refreshCall={refreshCall}
          data={editData} // pre-fill for edit
        />
      </Modal>
    </div>
  );
};

export default License;
