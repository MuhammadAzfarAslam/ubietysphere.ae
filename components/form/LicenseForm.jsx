"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postData, putData } from "@/utils/getData";
import FormButton from "../button/FormButton";
import { useToast } from "../toaster/ToastContext";

// Validation schema
const schema = yup.object({
  authority: yup.string().required("Authority is required"),
  licenceNumber: yup.string().required("Licence number is required"),
  specialization: yup.string().required("Specialization is required"),
  validFrom: yup.string().required("Valid from date is required"),
  validTo: yup.string().required("Valid to date is required"),
});

const LicenseForm = ({ id, accessToken, data = {}, setIsOpen, refreshCall }) => {
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      authority: data?.authority || "",
      licenceNumber: data?.licenceNumber || "",
      specialization: data?.specialization || "",
      validFrom: data?.validFrom || "",
      validTo: data?.validTo || "",
    },
  });

  const onSubmit = async (formData) => {
    const formatDate = (date) => {
      if (!date) return null;
      return new Date(date).toISOString().split("T")[0];
    };
  
    const payload = {
      authority: formData.authority,
      licenceNumber: formData.licenceNumber,
      specialization: formData.specialization,
      validFrom: formData.validFrom,
      validTo: formData.validTo,
    };
  
    try {
      if (data?.id) {
        await putData(
          `user/licences`,
          { id: data?.id, ...payload },
          { Authorization: `Bearer ${accessToken}` }
        );
        addToast("License record updated successfully!", "success");
      } else {
        await postData(`user/licences`, payload, {
          Authorization: `Bearer ${accessToken}`,
        });
        addToast("License record added successfully!", "success");
      }
  
      setIsOpen(false);
      await refreshCall();
    } catch (error) {
      console.error("License update failed:", error);
      addToast("Something went wrong!", "error");
    }
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 register-form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-light">Authority</label>
          <input
            type="text"
            {...register("authority")}
            placeholder="Authority (e.g., HIPPA)"
            className="mt-1 block w-full p-3 border rounded-sm shadow-sm focus:ring-2 focus:ring-primary text-primary-light"
          />
          <p className="text-red-500 text-sm">{errors.authority?.message}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-light">Licence Number</label>
          <input
            type="text"
            {...register("licenceNumber")}
            placeholder="Licence Number"
            className="mt-1 block w-full p-3 border rounded-sm shadow-sm focus:ring-2 focus:ring-primary text-primary-light"
          />
          <p className="text-red-500 text-sm">{errors.licenceNumber?.message}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-light">Specialization</label>
          <input
            type="text"
            {...register("specialization")}
            placeholder="Specialization"
            className="mt-1 block w-full p-3 border rounded-sm shadow-sm focus:ring-2 focus:ring-primary text-primary-light"
          />
          <p className="text-red-500 text-sm">{errors.specialization?.message}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-light">Valid From</label>
          <input
            type="date"
            {...register("validFrom")}
            className="mt-1 block w-full p-3 border rounded-sm shadow-sm focus:ring-2 focus:ring-primary text-primary-light"
          />
          <p className="text-red-500 text-sm">{errors.validFrom?.message}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-light">Valid To</label>
          <input
            type="date"
            {...register("validTo")}
            className="mt-1 block w-full p-3 border rounded-sm shadow-sm focus:ring-2 focus:ring-primary text-primary-light"
          />
          <p className="text-red-500 text-sm">{errors.validTo?.message}</p>
        </div>
      </div>

      <div>
        <FormButton additionalClass="w-full">
          {data?.id ? "Update License" : "Add License"}
        </FormButton>
      </div>
    </form>
  );
};

export default LicenseForm;
