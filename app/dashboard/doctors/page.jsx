import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getData from "@/utils/getData";
import { redirect } from "next/navigation";
import DoctorsList from "@/wrappers/DoctorsList";

const MyDoctors = async ({ searchParams }) => {
  const session = await getServerSession(authOptions);

  if (!["admin"]?.includes(session.user.role)) {
    return <p>Unauthorized: Admin only access</p>;
  }

  try {
    // Get query params
    const params = await searchParams;
    const page = params?.page || '0';
    const active = params?.active;
    const profession = params?.profession;

    // Build API URL with query parameters
    const apiParams = new URLSearchParams();
    apiParams.set('page', page);
    if (active) {
      apiParams.set('active', active);
    }
    if (profession) {
      apiParams.set('profession', profession);
    }

    const apiUrl = `user/doctors?${apiParams.toString()}`;

    const res = await getData(apiUrl, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    console.log("doctors res", res);

    return (
      <div>
        <DoctorsList
          initialData={res?.data}
          accessToken={session?.accessToken}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching doctors:", error);
    // If it's a 401 error, redirect to login with expired flag
    if (error.message?.includes("401")) {
      redirect("/login?expired=true");
    }
    return <p>Error loading doctors. Please try again.</p>;
  }
};

export default MyDoctors;
