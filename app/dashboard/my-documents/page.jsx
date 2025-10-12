import React from "react";
import Documents from "@/wrappers/Documents";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getData from "@/utils/getData";

const MyDocuments = async () => {
  const session = await getServerSession(authOptions);
  
  if (!["Patient", "Parent", "Doctor"]?.includes(session.user.role)) {
    return <p>Unauthorized: {session.user.role} only</p>;
  }

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
};

export default MyDocuments;
