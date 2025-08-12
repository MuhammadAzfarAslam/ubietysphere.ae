import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import React from "react";

const MyDocuments = async () => {
  const session = await getServerSession(authOptions);
  if (["Patient", "Parent"]?.includes(session.user.role)) {
    return <p>Unauthorized: {session.user.role} only</p>;
  }
  return <div>MyDocuments</div>;
};

export default MyDocuments;
