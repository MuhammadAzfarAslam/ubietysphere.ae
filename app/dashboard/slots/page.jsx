import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Slots from "@/wrappers/Slots";

const SlotsPage = async () => {
  const session = await getServerSession(authOptions);

  // Only doctors can access this page
  if (session?.user?.role !== "Doctor") {
    redirect("/dashboard");
  }

  return <Slots accessToken={session?.accessToken} services={session?.user?.services || []} />;
};

export default SlotsPage;
