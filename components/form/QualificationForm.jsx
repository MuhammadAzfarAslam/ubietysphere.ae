"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postData, putData } from "@/utils/getData";
import FormButton from "../button/FormButton";
import NationalitySelect from "./NationalitySelect";
import DegreeSelect from "./DegreeSelect";
import { useToast } from "../toaster/ToastContext";
import Link from "next/link";

// Define validation schema using Yup
const schema = yup.object({
  instituteName: yup.string().required("Last name is required"),
  fieldOfStudy: yup.string().required("fieldOfStudy is required"),
  country: yup.string().required("Country is required"),
  startDate: yup.string().required("Start Date is required"),
  endDate: yup.string().required("End Date is required"),
});

const QualificationForm = ({
  id,
  accessToken,
  data = {},
  setIsOpen,
  refreshCall,
}) => {
  console.log("datadata", data);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const { addToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      degreeType: data?.degreeType || "",
      instituteName: data?.institutionName || "",
      fieldOfStudy: data?.fieldOfStudy || "",
      country: data?.country || "",
      mobileNumber: data?.mobileNumber || "",
      startDate: data?.dateFrom ? data.dateFrom : "",
      endDate: data?.dateTo ? data.dateTo : "",
    },
  });

  const uploadEducationImage = async (id) => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append(
      "dto",
      new Blob([JSON.stringify({ id })], { type: "application/json" })
    );
    formData.append("image", selectedFile);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}user/qualifications/image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );
      console.log("image res", res);

      addToast("Education image uploaded successfully!", "success");
    } catch (error) {
      console.error("Education upload failed:", error);
      addToast("Failed to upload license image!", "error");
    }
  };

  const onSubmit = async (formData) => {
    const payload = {
      degreeType: formData?.degreeType,
      fieldOfStudy: formData?.fieldOfStudy,
      institutionName: formData?.instituteName,
      country: formData?.country,
      dateFrom: formData.startDate,
      dateTo: formData.endDate,
    };

    try {
      let educationId;
      if (data?.id) {
        // EDIT mode
        await putData(
          `user/qualifications`,
          { id: data?.id, ...payload },
          {
            Authorization: `Bearer ${accessToken}`,
          }
        );
        educationId = data?.id;
        addToast("Record has been updated!", "success");
      } else {
        // ADD mode
        await postData(`user/qualifications`, payload, {
          Authorization: `Bearer ${accessToken}`,
        });

        educationId = response?.data?.id; // Make sure API returns created license ID
        await uploadEducationImage(licenseId);
        addToast("Record has been added!", "success");
      }

      if (educationId) {
        await uploadEducationImage(educationId);
      }
      setIsOpen(false);
      await refreshCall();
    } catch (error) {
      console.error("Update failed:", error);
      addToast("Something went wrong!", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 register-form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <DegreeSelect
            register={register}
            name="degreeType"
            error={errors.degreeType}
          />
        </div>

        <div>
          <label
            htmlFor="instituteName"
            className="block text-sm font-medium text-light"
          >
            Institute Name
          </label>
          <input
            type="text"
            id="instituteName"
            name="instituteName"
            placeholder="Institute Name"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
            {...register("instituteName")}
          />
          <p className="text-red-500 text-sm">
            {errors.instituteName && errors.instituteName.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="fieldOfStudy"
            className="block text-sm font-medium text-light"
          >
            Field of Study
          </label>
          <input
            type="text"
            id="fieldOfStudy"
            name="fieldOfStudy"
            placeholder="Field of Study"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
            {...register("fieldOfStudy")}
          />
          <p className="text-red-500 text-sm">
            {errors.fieldOfStudy && errors.fieldOfStudy.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-light"
          >
            Country
          </label>
          <NationalitySelect
            register={register}
            defaultValue={data?.country || ""}
            name="country"
          />
          <p className="text-red-500 text-sm">{errors.country?.message}</p>
        </div>

        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-light"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
            {...register("startDate")}
          />
          <p className="text-red-500 text-sm">
            {errors.startDate && errors.startDate.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-light"
          >
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
            {...register("endDate")}
          />
          <p className="text-red-500 text-sm">
            {errors.endDate && errors.endDate.message}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-light">
            License Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="mt-1 block w-full p-3 border rounded-sm shadow-sm focus:ring-2 focus:ring-primary text-primary-light"
          />
        </div>

        <div>
          {/* <label
            htmlFor="passportNumber"
            className="block text-sm font-medium text-light"
          >
            Qualification Proof
          </label>
          <input
            type="file"
            id="proof"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
            {...register("proof")}
          />
          <p className="text-red-500 text-sm">
            {errors.proof?.message}
          </p> */}
        </div>
      </div>

      {data?.imageName && data?.imageName !== null ? (
        <div className="text-center text-primary-light underline hover:text-blue-500">
          <Link href={`/preview?url=img/qualification-images/${data?.imageName}`}>
            View File
          </Link>
        </div>
      ) : null}

      <div>
        <FormButton additionalClass={"w-full"}>{data?.id ? 'Update' : 'Add'}</FormButton>
      </div>
    </form>
  );
};

export default QualificationForm;
