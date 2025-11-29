import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const SlotsPage = async () => {
  const session = await getServerSession(authOptions);

  // Only doctors can access this page
  if (session?.user?.role !== "Doctor") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">My Slots</h2>
        <button className="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-light transition">
          Add Slot
        </button>
      </div>

      {/* Slots content will go here */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <p className="text-gray-600">Your slots will appear here.</p>
      </div>
    </div>
  );
};

export default SlotsPage;
