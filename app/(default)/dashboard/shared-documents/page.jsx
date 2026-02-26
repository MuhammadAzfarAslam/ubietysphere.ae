import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import React from "react";

const SharedDocuments = async () => {
  const session = await getServerSession(authOptions);

  if (session.user.role !== "Doctor") {
    return <p>Unauthorized: Doctors only</p>;
  }
  return <div>SharedDocuments</div>;
};

export default SharedDocuments;
