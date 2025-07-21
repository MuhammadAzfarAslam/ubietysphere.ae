"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postData } from "@/utils/getData";
import FormButton from "../button/FormButton";

// Define validation schema using Yup
const schema = yup.object({
  password: yup.string().required("Password is required"), // Required validation
});

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const [token, setToken] = useState(null);
  const [isOkay, setIsOkay] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    const param = searchParams.get("token");
    setToken(param); // Update state when the query parameter changes
  }, [searchParams]);

  const onSubmit = async (data) => {
    const { password } = data;
    const res = await postData(
      `reset-password`,
      { newPassword: email, token } 
    );

    if (res.ok) {
      setIsOkay(true);
    } else {
      alert("Invalid credentials");
    }
  };

  if (isOkay) {
    return (
      <div className="text-center text-secondary">
        <p className="text-lg">Your password has been reset successfully.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-white"
        >
          Enter New Password: {token}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter new password"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:primary text-white"
          {...register("password")}
        />
        <p className="text-red-500 text-sm mb-0">
          {errors.password && errors.password.message} &nbsp;
        </p>
      </div>

      <div>
        <FormButton additionalClass={"w-full"}>Reset</FormButton>
      </div>
    </form>
  );
};

export default ResetPassword;
