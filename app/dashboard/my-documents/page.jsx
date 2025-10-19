import React from "react";
import Documents from "@/wrappers/Documents";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getData from "@/utils/getData";
import { redirect } from "next/navigation";

const MyDocuments = async () => {
  const session = await getServerSession(authOptions);
  
  // Check if session exists and has required data
  if (!session || !session.user || !session.user.role) {
    console.log("🚨 Invalid session data, redirecting to login");
    redirect("/login");
  }

  // Check if accessToken exists
  if (!session.accessToken || session.accessToken === "") {
    console.log("🚨 No accessToken found in session, redirecting to login");
    redirect("/login");
  }
  
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
    // If it's a 401 error, the getData utility will handle the logout
    // For other errors, we can show an error message or redirect
    if (error.message?.includes("401")) {
      redirect("/login");
    }
    return <p>Error loading documents. Please try again.</p>;
  }
};

export default MyDocuments;
