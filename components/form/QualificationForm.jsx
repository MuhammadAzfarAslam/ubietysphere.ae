"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { putData } from "@/utils/getData";
import FormButton from "../button/FormButton";
import NationalitySelect from "./NationalitySelect";
import CategorySelect from "./CategorySelect";
import DegreeSelect from "./DegreeSelect";

// Define validation schema using Yup
const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  instituteName: yup.string().required("Last name is required"),
  fieldOfStudy: yup.string().required("fieldOfStudy is required"),
  country: yup.string().required("Country is required"),
  startDate: yup.date().required("Start Date is required"),
  endDate: yup.date().required("End Date is required"),
});

const QualificationForm = ({ data, accessToken }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: data?.firstName || "",
      instituteName: data?.instituteName || "",
      fieldOfStudy: data?.fieldOfStudy || "",
      country: data?.details?.country || "",
      mobileNumber: data?.mobileNumber || "",
      startDate: data?.startDate ? data.startDate.split("T")[0] : "",
      endDate: data?.endDate ? data.endDate.split("T")[0] : "",
    },
  });

  const onSubmit = async (formData) => {
    const formattedDate = new Date(formData.startDate)
      .toISOString()
      .split("T")[0];

    const payload = {
      id: data?.id, // original user id
    };

    console.log("Update payload:", payload);

    try {
      const response = await putData(`user`, payload, {
        Authorization: `Bearer ${accessToken}`,
      });
      console.log("Update response:", response);
    } catch (error) {
      console.error("Update failed:", error);
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
            defaultValue={data?.details?.country || ""}
            name="Country"
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
          <label
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
          </p>
        </div>

      
      </div>

      <div>
        <FormButton additionalClass={"w-full"}>Add</FormButton>
      </div>
    </form>
  );
};

export default QualificationForm;
