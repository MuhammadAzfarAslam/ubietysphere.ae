"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { putData } from "@/utils/getData";
import FormButton from "../button/FormButton";
import NationalitySelect from "./NationalitySelect";
import CategorySelect from "./CategorySelect";
import { useToast } from "../toaster/ToastContext";
import PhoneInput from "./PhoneInput";

const GeneralForm = ({ data, accessToken }) => {
  // Define validation schema dynamically based on user role
  const schema = yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    dateOfBirth: yup.string().required("Date of birth is required"),
    gender: yup.string().required("Gender is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    mobileNumber: yup
      .number()
      .typeError("Must be a number")
      .required("Mobile number is required"),
    address: yup.string(),
    nationality: yup.string().required("Nationality is required"),
    // Category is only required for Doctors
    ...(data?.role === "Doctor" && {
      category: yup.string().required("Category is required"),
      totalExperience: yup.string(),
      workDays: yup.array().of(yup.string()),
    }),
    x: yup.string().nullable(),
    instagram: yup.string().nullable(),
    linkedin: yup.string().nullable(),
    facebook: yup.string().nullable(),
  });
  const { addToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
      mobileNumber: data?.mobileNumber || "",
      dateOfBirth: data?.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
      gender: data?.gender || "",
      address: data?.details?.address || "",
      nationality: data?.details?.nationality || "",
      nationalId: data?.details?.nationalId || "",
      passportNumber: data?.details?.passportNumber || "",
      bio: data?.details?.bio || "",
      x: data?.details?.socialMediaUrls?.x || "",
      instagram: data?.details?.socialMediaUrls?.instagram || "",
      linkedin: data?.details?.socialMediaUrls?.linkedin || "",
      facebook: data?.details?.socialMediaUrls?.facebook || "",
      // Only include doctor-specific fields for Doctors
      ...(data?.role === "Doctor" && {
        category: data?.details?.category || "",
        totalExperience: data?.details?.totalExperience || "",
        workDays: data?.details?.workDays || [],
      }),
    },
  });

  const onSubmit = async (formData) => {
    console.log("Form submitted with data:", formData);
    const formattedDate = new Date(formData.dateOfBirth)
      .toISOString()
      .split("T")[0];

    // Build details object based on role
    const details = {
      middleName1: null,
      middleName2: null,
      address: formData.address,
      nationality: formData.nationality,
      nationalId: Number(formData.nationalId),
      passportNumber: formData.passportNumber,
      bio: formData.bio,
      socialMediaUrls: {
        x: formData.x || "",
        instagram: formData.instagram || "",
        linkedin: formData.linkedin || "",
        facebook: formData.facebook || "",
      },
    };

    // Only include doctor-specific fields for Doctors
    if (data?.role === "Doctor") {
      details.category = formData.category;
      details.totalExperience = Number(formData.totalExperience);
      details.workDays = formData.workDays || [];
    }

    const payload = {
      id: data?.id, // original user id
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formattedDate,
      gender: formData.gender,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      role: data?.role, // keep same
      active: data?.active, // keep same
      details,
    };

    console.log("Update payload:", payload);

    try {
      const response = await putData(`user`, payload, {
        Authorization: `Bearer ${accessToken}`,
      });
      console.log("Update response:", response);
      addToast("Your info has been updated!", "success");
    } catch (error) {
      console.error("Update failed:", error);
      addToast("Something went wrong!", "error");
    }
  };

  // Experience options now have label/value
  const experienceOptions = [
    { label: "<1 year", value: 0 },
    ...Array.from({ length: 30 }, (_, i) => ({
      label: `${i + 1} year${i > 0 ? "s" : ""}`,
      value: i + 1,
    })),
  ];

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const onError = (errors) => {
    console.log("Form validation errors:", errors);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-light"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary placeholder-primary-light text-primary-light"
            {...register("firstName")}
          />
          <p className="text-red-500 text-sm">
            {errors.firstName && errors.firstName.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-light"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
            {...register("lastName")}
          />
          <p className="text-red-500 text-sm">
            {errors.lastName && errors.lastName.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-light"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
            {...register("email")}
          />
          <p className="text-red-500 text-sm">
            {errors.email && errors.email.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="mobileNumber"
            className="block text-sm font-medium text-light"
          >
            Mobile Number
          </label>
          <PhoneInput
            register={register}
            setValue={setValue}
            name="mobileNumber"
            error={errors.mobileNumber}
            defaultCountryCode="AE"
            placeholder="Enter mobile number"
            inputClassName="text-primary-light focus:border-0"
          />
          <p className="text-red-500 text-sm">
            {errors.mobileNumber && errors.mobileNumber.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-light"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
            {...register("dateOfBirth")}
          />
          <p className="text-red-500 text-sm">
            {errors.dateOfBirth && errors.dateOfBirth.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-light"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
            {...register("gender")}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <p className="text-red-500 text-sm">
            {errors.gender && errors.gender.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-light"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
            {...register("address")}
          />
          <p className="text-red-500 text-sm">{errors.address?.message}</p>
        </div>
        <div>
          <label
            htmlFor="nationality"
            className="block text-sm font-medium text-light"
          >
            Nationality
          </label>
          <NationalitySelect
            register={register}
            defaultValue={data?.details?.nationality || ""}
            name="nationality"
          />
          <p className="text-red-500 text-sm">{errors.nationality?.message}</p>
        </div>

        <div>
          <label
            htmlFor="nationalId"
            className="block text-sm font-medium text-light"
          >
            National ID
          </label>
          <input
            type="text"
            id="nationalId"
            placeholder="National ID"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
            {...register("nationalId")}
          />
          <p className="text-red-500 text-sm">{errors.nationalId?.message}</p>
        </div>
        <div>
          <label
            htmlFor="passportNumber"
            className="block text-sm font-medium text-light"
          >
            Passport Number
          </label>
          <input
            type="text"
            id="passportNumber"
            placeholder="Passport Number"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
            {...register("passportNumber")}
          />
          <p className="text-red-500 text-sm">
            {errors.passportNumber?.message}
          </p>
        </div>

        {data?.role === "Doctor" && (
          <>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-light"
              >
                Category
              </label>
              <CategorySelect
                register={register}
                defaultValue={data?.details?.category || ""}
              />
              <p className="text-red-500 text-sm">{errors.category?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-light">
                Total Experience
              </label>
              <select
                {...register("totalExperience")}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:ring-primary text-primary-light"
              >
                <option value="">Select Experience</option>
                {experienceOptions.map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-red-500 text-sm">
                {errors.totalExperience?.message}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Full Width Columns */}
      {data?.role === "Doctor" && (
        <>
          <div>
            <label className="block text-sm font-medium text-light">
              Work Days
            </label>
            <div className="grid grid-cols-2 gap-2">
              {weekDays.map((day) => (
                <label key={day} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={day}
                    {...register("workDays")}
                  />
                  {day}
                </label>
              ))}
            </div>
            <p className="text-red-500 text-sm">{errors.workDays?.message}</p>
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-light"
            >
              Add your introduction
            </label>
            <textarea
              name="bio"
              id="bio"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:border-0 focus:ring-2 focus:ring-primary text-primary-light"
              {...register("bio")}
            ></textarea>
            <p className="text-red-500 text-sm">{errors.bio?.message}</p>
          </div>
        </>
      )}

      {data?.role === "Doctor" && (
        <>
          <h2 className="pt-4 mb-0 font-bold text-primary-light">Socials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-medium text-light"
                htmlFor="x"
              >
                X
              </label>
              <input
                type="text"
                placeholder="x.com/username"
                {...register("x")}
                id="x"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-light"
                htmlFor="instagram"
              >
                Instagram
              </label>
              <input
                type="text"
                id="instagram"
                placeholder="instagram.com/username"
                {...register("instagram")}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-light"
                htmlFor="linkedin"
              >
                LinkedIn
              </label>
              <input
                type="text"
                id="linkedin"
                placeholder="linkedin.com/in/username"
                {...register("linkedin")}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-light"
                htmlFor="facebook"
              >
                Facebook
              </label>
              <input
                type="text"
                id="facebook"
                placeholder="facebook.com/username"
                {...register("facebook")}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm"
              />
            </div>
          </div>
        </>
      )}

      <div>
        <FormButton additionalClass={"w-full"}>Update</FormButton>
      </div>
    </form>
  );
};

export default GeneralForm;
