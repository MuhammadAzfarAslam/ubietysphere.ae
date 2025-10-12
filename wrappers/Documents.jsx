"use client";
import React, { useState } from "react";
import EducationHeader from "@/components/header/EducationHeader";
import EditDeleteList from "@/components/list/EditDeleteList";
import DocumentForm from "@/components/form/DocumentForm";
import Modal from "@/components/modal/Modal";
import ShareDocument from "@/components/modal/ShareDocument";
import { useToast } from "@/components/toaster/ToastContext";
import getData, { postData } from "@/utils/getData";

const Documents = ({ data, id, accessToken }) => {
  const { addToast } = useToast();
  const [content, setContent] = useState(data?.content || []);

  // For Add/Edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // For Share modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState(null);

  const refreshCall = async () => {
    const res = await getData("user/reports", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setContent(res?.data?.content || []);
  };

  const deleteHandler = async (id) => {
    try {
      const response = await postData(
        `user/reports/${id}`,
        null,
        {
          Authorization: `Bearer ${accessToken}`,
        },
        "DELETE"
      );
      await refreshCall();
      addToast("Document has been deleted!", "success");
    } catch (error) {
      console.error("Delete failed:", error);
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

  const shareHandler = (documentId) => {
    const documentToShare = content.find((item) => item.id === documentId);
    setShareData(documentToShare);
    setIsShareModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <EducationHeader onAdd={addHandler} title="Documents" />
      {content?.map((item) => (
        <EditDeleteList
          key={item?.id}
          id={item?.id} 
          title={item?.title || item?.fileName || "Document"}
          fieldOfStudy={item?.category || item?.type || "Report"}
          fileName={item?.fileName}
          showShare={true}
          deleteHandler={deleteHandler}
          editHandler={editHandler}
          shareHandler={shareHandler}
        />
      ))}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editData ? "Edit Document" : "Add Document"}
      >
        <DocumentForm
          id={id}
          accessToken={accessToken}
          setIsOpen={setIsModalOpen}
          refreshCall={refreshCall}
          data={editData} // pre-fill for edit
        />
      </Modal>

      {/* Share Document Modal */}
      <ShareDocument
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        documentData={shareData}
      />
    </div>
  );
};

export default Documents;
