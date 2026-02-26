import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getData from "@/utils/getData";
import License from "@/wrappers/License";
import { redirect } from "next/navigation";

const LicensePage = async () => {
  const session = await getServerSession(authOptions);

  try {
    const res = await getData("user/licences", {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    console.log("licences res", res);

    return (
      <div>
        <License data={res?.data} accessToken={session?.accessToken} id={session?.sub} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching licences:", error);
    // If it's a 401 error, redirect to login with expired flag
    if (error.message?.includes("401")) {
      redirect("/login?expired=true");
    }
    return <p>Error loading license data. Please try again.</p>;
  }
};

export default LicensePage;
