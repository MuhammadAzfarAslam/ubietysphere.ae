"use client";
import React, { useState } from "react";
import EducationHeader from "@/components/header/EducationHeader";
import EditDeleteList from "@/components/list/EditDeleteList";
import { useToast } from "@/components/toaster/ToastContext";
import getData, { postData } from "@/utils/getData";

const Education = ({ data, id, accessToken }) => {
  const { addToast } = useToast();
  const [content, setContent] = useState(data?.content);

  const refreshCall = async () => {
    const res = await getData("user/qualifications", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    setContent(res?.data?.content);
  };

  const deleteHandler = async (id) => {
    try {
      const response = await postData(
        `user/qualifications/${id}`,
        null,
        {
          Authorization: `Bearer ${accessToken}`,
        },
        "DELETE"
      );
      console.log("Update response:", response);
      await refreshCall();
      addToast("Qualification has been deleted!", "success");
    } catch (error) {
      console.error("Update failed:", error);
      addToast("Something went wrong!", "error");
    }
  };
  
  return (
    <div className="space-y-6">
      <EducationHeader accessToken={accessToken} id={id} refreshCall={refreshCall} />
      {content?.map((item) => (
        <EditDeleteList
          key={item?.id}
          id={item?.id}
          title={item?.degreeType}
          fieldOfStudy={item?.fieldOfStudy}
          deleteHandler={deleteHandler}
        />
      ))}
    </div>
  );
};

export default Education;
