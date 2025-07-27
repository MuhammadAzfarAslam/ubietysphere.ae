"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postData } from "@/utils/getData";
import CategorySelect from "./CategorySelect";
import FormButton from "../button/FormButton";

// Define validation schema using Yup
const schema = yup.object({
  name: yup.string().required("Name is required"), // Required validation
  email: yup
    .string()
    .email("Please enter a valid email address") // Email validation
    .required("Email is required"),
  subject: yup.string().required("Subject is required"), // Required validation
});

const Contact = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const res = await postData(`contact`, data);
    console.log("res", res);

    if (res.status === 201) {
      setIsSubmit(true);
      reset();
    } else {
      alert("Something went wrong, please try again!");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name*
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your Name"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:primary"
          {...register("name")}
        />
        <p className="text-red-500 text-sm">
          {errors.name && errors.name.message} &nbsp;
        </p>
      </div>

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
          className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:primary"
          {...register("email")}
        />
        <p className="text-red-500 text-sm mb-0">
          {errors.email && errors.email.message} &nbsp;
        </p>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-light"
        >
          Subject*
        </label>
        <CategorySelect register={register} name="subject" />
        <p className="text-red-500 text-sm">{errors.subject?.message}</p>
      </div>

      <div className="mt-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Message
        </label>
        <textarea
          name=""
          id="message"
          message="message"
          placeholder="Enter your Message"
          className="mt-1 block w-full h-40 p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:primary"
          {...register("message")}
        ></textarea>
        <p classmessage="text-red-500 text-sm">
          {errors.message && errors.message.message} &nbsp;
        </p>
      </div>

      <div className="flex items-center gap-5">
        <FormButton disabled={isSubmitting}>Submit</FormButton>{" "}
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

      {isSubmit && (
        <div>
          <p className="mt-3 text-green-900 font-bold">
            Thanks for messaging Us, We will contact back soon!
          </p>
        </div>
      )}
    </form>
  );
};

export default Contact;
