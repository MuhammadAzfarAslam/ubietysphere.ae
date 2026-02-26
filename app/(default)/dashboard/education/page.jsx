import React from "react";
import Education from "@/wrappers/Education";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getData from "@/utils/getData";
import { redirect } from "next/navigation";

const EducationPage = async () => {
  const session = await getServerSession(authOptions);

  try {
    const res = await getData("user/qualifications", {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    console.log("res", res);

    return (
      <div>
        <Education data={res?.data} accessToken={session?.accessToken} id={session?.sub} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching qualifications:", error);
    // If it's a 401 error, redirect to login with expired flag
    if (error.message?.includes("401")) {
      redirect("/login?expired=true");
    }
    return <p>Error loading education data. Please try again.</p>;
  }
};

export default EducationPage;
