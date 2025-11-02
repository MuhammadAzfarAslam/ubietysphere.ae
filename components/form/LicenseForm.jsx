"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postData, putData } from "@/utils/getData";
import FormButton from "../button/FormButton";
import { useToast } from "../toaster/ToastContext";
import Link from "next/link";
import DatePicker from "./DatePicker";

// Validation schema
const schema = yup.object({
  authority: yup.string().required("Authority is required"),
  licenceNumber: yup.string().required("Licence number is required"),
  specialization: yup.string().required("Specialization is required"),
  validFrom: yup.string().required("Valid from date is required"),
  validTo: yup.string().required("Valid to date is required"),
});

const LicenseForm = ({
  id,
  accessToken,
  data = {},
  setIsOpen,
  refreshCall,
}) => {
  const { addToast } = useToast();
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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

  const uploadLicenseImage = async (id) => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append(
      "dto",
      new Blob([JSON.stringify({ id })], { type: "application/json" })
    );
    formData.append("image", selectedFile);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}user/licences/image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );
      console.log("image res", res);

      addToast("License image uploaded successfully!", "success");
    } catch (error) {
      console.error("Image upload failed:", error);
      addToast("Failed to upload license image!", "error");
    }
  };

  const onSubmit = async (formData) => {
    const payload = {
      authority: formData.authority,
      licenceNumber: formData.licenceNumber,
      specialization: formData.specialization,
      validFrom: formData.validFrom,
      validTo: formData.validTo,
    };

    try {
      let licenseId;

      if (data?.id) {
        await putData(
          `user/licences`,
          { id: data?.id, ...payload },
          { Authorization: `Bearer ${accessToken}` }
        );
        licenseId = data?.id;
        addToast("License record updated successfully!", "success");
      } else {
        const response = await postData(`user/licences`, payload, {
          Authorization: `Bearer ${accessToken}`,
        });
        licenseId = response?.data?.id; // Make sure API returns created license ID
        await uploadLicenseImage(licenseId);
        addToast("License record added successfully!", "success");
      }

      // Upload the license image if a file was selected
      console.log("data", data);

      if (licenseId) {
        await uploadLicenseImage(licenseId);
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
          <label className="block text-sm font-medium text-light">
            Authority
          </label>
          <input
            type="text"
            {...register("authority")}
            placeholder="Authority (e.g., HIPPA)"
            className="mt-1 block w-full p-3 border rounded-sm shadow-sm focus:ring-2 focus:ring-primary text-primary-light"
          />
          <p className="text-red-500 text-sm">{errors.authority?.message}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-light">
            Licence Number
          </label>
          <input
            type="text"
            {...register("licenceNumber")}
            placeholder="Licence Number"
            className="mt-1 block w-full p-3 border rounded-sm shadow-sm focus:ring-2 focus:ring-primary text-primary-light"
          />
          <p className="text-red-500 text-sm">
            {errors.licenceNumber?.message}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-light">
            Specialization
          </label>
          <input
            type="text"
            {...register("specialization")}
            placeholder="Specialization"
            className="mt-1 block w-full p-3 border rounded-sm shadow-sm focus:ring-2 focus:ring-primary text-primary-light"
          />
          <p className="text-red-500 text-sm">
            {errors.specialization?.message}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-light">
            Valid From
          </label>
          <DatePicker
            register={register}
            setValue={setValue}
            name="validFrom"
            error={errors.validFrom}
            defaultValue={data?.validFrom}
            placeholder="DD-MMM-YYYY"
            inputClassName="text-primary-light focus:border-0"
          />
          <p className="text-red-500 text-sm">{errors.validFrom?.message}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-light">
            Valid To
          </label>
          <DatePicker
            register={register}
            setValue={setValue}
            name="validTo"
            error={errors.validTo}
            defaultValue={data?.validTo}
            placeholder="DD-MMM-YYYY"
            inputClassName="text-primary-light focus:border-0"
          />
          <p className="text-red-500 text-sm">{errors.validTo?.message}</p>
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
      </div>

      {data?.imageName && data?.imageName !== null ? (
        <div className="text-center text-primary-light underline hover:text-blue-500">
          <Link
            href={`/preview?url=img/licence-images/${data?.imageName}`}
          >
            View File
          </Link>
        </div>
      ) : null}

      <div>
        <FormButton additionalClass="w-full">
          {data?.id ? "Update License" : "Add License"}
        </FormButton>
      </div>
    </form>
  );
};

export default LicenseForm;
