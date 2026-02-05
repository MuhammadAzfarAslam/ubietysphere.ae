import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import PaymentsList from "@/wrappers/PaymentsList";

const PaymentsPage = async ({ searchParams }) => {
  const session = await getServerSession(authOptions);

  if (!["admin"]?.includes(session.user.role)) {
    return <p>Unauthorized: Admin only access</p>;
  }

  return (
    <div>
      <Suspense fallback={<div className="text-center py-8"><p className="text-gray-500">Loading payments...</p></div>}>
        <PaymentsList accessToken={session?.accessToken} />
      </Suspense>
    </div>
  );
};

export default PaymentsPage;
