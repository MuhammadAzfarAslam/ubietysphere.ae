import React from "react";
import Documents from "@/wrappers/Documents";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getData from "@/utils/getData";
import { redirect } from "next/navigation";

const MyDocuments = async () => {
  const session = await getServerSession(authOptions);

  if (!["Patient", "Parent", "Doctor", "admin"]?.includes(session.user.role)) {
    return <p>Unauthorized: {session.user.role} only</p>;
  }

  try {
    const res = await getData("user/reports", {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    console.log("documents res", res);

    return (
      <div>
        <Documents data={res?.data} accessToken={session?.accessToken} id={session?.sub} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching documents:", error);
    // If it's a 401 error, redirect to login with expired flag
    if (error.message?.includes("401")) {
      redirect("/login?expired=true");
    }
    return <p>Error loading documents. Please try again.</p>;
  }
};

export default MyDocuments;
