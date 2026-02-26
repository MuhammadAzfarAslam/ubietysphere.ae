import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AppointmentRoom from "@/wrappers/AppointmentRoom";

const AppointmentRoomPage = async () => {
  const session = await getServerSession(authOptions);

  // Doctors, patients, and parents can access this page
  const allowedRoles = ["doctor", "patient", "parent"];
  if (!allowedRoles.includes(session?.user?.role?.toLowerCase())) {
    redirect("/dashboard");
  }

  return <AppointmentRoom accessToken={session?.accessToken} userRole={session?.user?.role} />;
};

export default AppointmentRoomPage;
