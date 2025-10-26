"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import getData, { postData } from "@/utils/getData";
import FormButton from "../button/FormButton";
import Link from "next/link";

// Define validation schema using Yup
const schema = yup.object({
  email: yup.string().email().required("Email is required"), // Required validation
});

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const [isLoading, setisLoading] = useState(false);
  const [isOkay, setIsOkay] = useState(false);
  const [isResend, setIsResend] = useState(false);
  const [token, setToken] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    const param = searchParams.get("token");
    if (param) {
      verifyCall(param); // Update state when the query parameter changes
    }
  }, [searchParams]);

  const verifyCall = async (token) => {
    const res = await getData(`verify-email?token=${token}`);
    console.log("res", res);

    if (res.status === 200) {
      setisLoading(false);
      setIsOkay(true);
    } else {
      alert("Invalid credentials");
    }
  };

  const onSubmit = async (data) => {
    const { email } = data;
    const res = await postData(`resend-verification`, { email });
    if (res.status === 200) {
      setIsResend(true);
    } else {
      alert("Invalid credentials");
    }
  };

  if (isLoading) {
    return (
      <div role="status text-center">
        <svg
          aria-hidden="true"
          className="w-40 h-40 text-gray-200 mx-auto animate-spin dark:text-primary fill-secondary"
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
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (isOkay) {
    return (
      <div className="text-center text-primary-light">
        <div className="tick mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="w-40 h-40 border-8 mx-auto rounded-full bi bi-check text-primary"
            viewBox="0 0 16 16"
          >
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
          </svg>
        </div>
        <p className="text-lg">
          Your email has been verified successfully,{" "}
          <Link className="underline" href={"/login"}>please click here to login</Link>.
        </p>
      </div>
    );
  }

  if (isResend) {
    return (
      <div className="text-center text-primary-light">
        <div className="tick mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="w-40 h-40 border-8 mx-auto rounded-full bi bi-check text-primary"
            viewBox="0 0 16 16"
          >
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
          </svg>
        </div>
        <p className="text-lg">
          Please check your email for new verification link.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      <p className="text-primary-light mb-3">
        Your token has been expired, please Resend token.
      </p>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white">
          Enter Your Email: {token}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter new email"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:primary text-white"
          {...register("email")}
        />
        <p className="text-red-500 text-sm mb-0">
          {errors.email && errors.email.message} &nbsp;
        </p>
      </div>

      <div>
        <FormButton additionalClass={"w-full"}>Send</FormButton>
      </div>
    </form>
  );
};

export default VerifyEmail;
