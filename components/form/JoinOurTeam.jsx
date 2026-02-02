"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postData } from "@/utils/getData";
import FormButton from "../button/FormButton";
import { useToast } from "../toaster/ToastContext";
import CategorySelect from "./CategorySelect";
import PhoneInput from "./PhoneInput";

// Define validation schema using Yup
const schema = yup.object({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
  discipline: yup.string().required("Please select a discipline"),
  totalExperience: yup
    .number()
    .required("Total years of experience is required")
    .min(0, "Experience cannot be negative")
    .max(50, "Experience seems too high"),
  coverLetter: yup.string().required("Cover letter is required"),
  resume: yup.mixed().required("Resume is required"),
  license: yup.mixed().required("License is required"),
});

const JoinOurTeam = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const { addToast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    console.log("Resume file:", resumeFile);
    console.log("License file:", licenseFile);
    
    // Validate files are selected
    if (!resumeFile || !licenseFile) {
      addToast("Please select both resume and license files", "error");
      return;
    }

    // Create FormData to handle file uploads
    const formData = new FormData();
    
    // Create the DTO object as JSON string (matching API format)
    const dto = {
      firstName: data.firstName,
      lastName: data.lastName,
      totalExperience: parseInt(data.totalExperience),
      phone: data.phone,
      coverLetter: data.coverLetter,
      email: data.email,
      discipline: data.discipline
    };
    
    console.log("DTO object:", dto);
    
    // Append the DTO as Blob (binary) - matching LicenseForm format
    formData.append(
      "dto",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );
    
    // Append files
    formData.append("resume", resumeFile);
    formData.append("license", licenseFile);
    
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      // Use direct fetch like in LicenseForm instead of postData utility
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}user/doctor-applications`, {
        method: "POST",
        body: formData,
      });
      
      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);
      
      const responseText = await res.text();
      console.log("Response body:", responseText);

      if (res.status === 201 || res.status === 200) {
        setIsSubmit(true);
        addToast("Application submitted successfully! We will review your submission and get back to you soon.", "success");
        reset();
        setResumeFile(null);
        setLicenseFile(null);
      } else {
        console.error("API Error:", responseText);
        addToast(`Something went wrong! Status: ${res.status}`, "error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      addToast("Something went wrong, please try again!", "error");
    }
  };

  const handleResumeChange = (file) => {
    setResumeFile(file);
    setValue("resume", file);
  };

  const handleLicenseChange = (file) => {
    setLicenseFile(file);
    setValue("license", file);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* First Row: First Name and Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name*
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Enter your first name"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            {...register("firstName")}
          />
          <p className="text-red-500 text-sm">
            {errors.firstName && errors.firstName.message} &nbsp;
          </p>
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name*
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Enter your last name"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            {...register("lastName")}
          />
          <p className="text-red-500 text-sm">
            {errors.lastName && errors.lastName.message} &nbsp;
          </p>
        </div>
      </div>

      {/* Second Row: Email and Mobile Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            {...register("email")}
          />
          <p className="text-red-500 text-sm">
            {errors.email && errors.email.message} &nbsp;
          </p>
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Mobile Number*
          </label>
          <PhoneInput
            register={register}
            setValue={setValue}
            name="phone"
            error={errors.phone}
            defaultCountryCode="AE"
            placeholder="Enter phone number"
          />
          <p className="text-red-500 text-sm">
            {errors.phone && errors.phone.message} &nbsp;
          </p>
        </div>
      </div>

      {/* Third Row: Discipline and Total Years of Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Discipline */}
        <div>
          <label
            htmlFor="discipline"
            className="block text-sm font-medium text-gray-700"
          >
            Which discipline are you applying for*
          </label>
          <CategorySelect
            setValue={setValue}
            defaultValue=""
            name="discipline"
          />
          <p className="text-red-500 text-sm">
            {errors.discipline && errors.discipline.message} &nbsp;
          </p>
        </div>

        {/* Total Years of Experience */}
        <div>
          <label
            htmlFor="totalExperience"
            className="block text-sm font-medium text-gray-700"
          >
            Total Years of Experience*
          </label>
          <input
            type="number"
            id="totalExperience"
            name="totalExperience"
            placeholder="Enter years of experience"
            min="0"
            max="50"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            {...register("totalExperience")}
          />
          <p className="text-red-500 text-sm">
            {errors.totalExperience && errors.totalExperience.message} &nbsp;
          </p>
        </div>
      </div>

      {/* Fourth Row: Resume and License Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Resume*
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => handleResumeChange(e.target.files[0])}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:ring-primary text-gray-700"
          />
          <p className="text-red-500 text-sm">
            {errors.resume && errors.resume.message} &nbsp;
          </p>
        </div>

        {/* License Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            License*
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleLicenseChange(e.target.files[0])}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:ring-2 focus:ring-primary text-gray-700"
          />
          <p className="text-red-500 text-sm">
            {errors.license && errors.license.message} &nbsp;
          </p>
        </div>
      </div>

      {/* Cover Letter Row */}
      <div>
        <label
          htmlFor="coverLetter"
          className="block text-sm font-medium text-gray-700"
        >
          Cover Letter*
        </label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          rows="4"
          placeholder="Tell us why you want to join our team..."
          className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          {...register("coverLetter")}
        />
        <p className="text-red-500 text-sm">
          {errors.coverLetter && errors.coverLetter.message} &nbsp;
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-5">
        <FormButton disabled={isSubmitting}>Submit Application</FormButton>
        {isSubmitting && (
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-primary fill-secondary"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        )}
      </div>

      {/* Success Message */}
      {isSubmit && (
        <div>
          <p className="mt-3 text-green-900 font-bold">
            Thank you for your application! We will review your submission and get back to you soon.
          </p>
        </div>
      )}
    </form>
  );
};

export default JoinOurTeam;
