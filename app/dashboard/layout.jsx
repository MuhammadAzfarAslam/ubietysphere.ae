import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Logout from "@/components/button/Logout";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ params, children }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Redirect unauthenticated users
    redirect('/login');
  }

  // Example: check role
  if (session.user.role !== "Doctor") {
    return <p>Unauthorized: Doctors only</p>;
  }
  return <div>
    <h1>Welcome, {session.user.name}</h1>
    <p>Role: {session.user.role}</p>
    <Logout />
    {children}</div>;
};

export default DashboardLayout;
