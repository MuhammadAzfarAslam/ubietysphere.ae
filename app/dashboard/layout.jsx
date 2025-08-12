import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Logout from "@/components/button/Logout";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ToastProvider } from "@/components/toaster/ToastContext";

const sideMenu = [
  {
    name: "General Info",
    href: "/dashboard",
    role: ["Doctor", "Patient", "Parent"],
  },
  { name: "Education", href: "/dashboard/education", role: ["Doctor"] },
  { name: "License", href: "/dashboard/license", role: ["Doctor"] },
  {
    name: "My Documents",
    href: "/dashboard/my-documents",
    role: ["Patient", "Parent"],
  },
  {
    name: "Shared Documents",
    href: "/dashboard/shared-documents",
    role: ["Doctor"],
  },
];

const DashboardLayout = async ({ params, children }) => {
  const session = await getServerSession(authOptions);
  console.log("📜 Session:", session);

  if (!session) {
    // Redirect unauthenticated users
    redirect("/login");
  }

  // Example: check role
  if (session.user.role !== "Doctor") {
    return <p>Unauthorized: Doctors only</p>;
  }
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:space-x-8">
            <div className="left-sidebar lg:w-1/4 sticky top-0 p-4 bg-white lg:h-[calc(100vh-160px)] lg:min-h-[300px] shadow-md rounded-lg">
              <nav className="flex flex-col h-full ">
                <ul className="lg:space-y-4 space-y-0.5 flex-1">
                  {sideMenu.map(
                    (item) =>
                      item.role.includes(session.user.role) && (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className="text-lg font-semibold text-gray-700 hover:text-primary-light"
                          >
                            {item.name}
                          </Link>
                        </li>
                      )
                  )}
                </ul>
                <Logout />
              </nav>
            </div>

            <div className="content lg:flex-1 w-full bg-white shadow-md p-8 rounded-lg mt-3 lg:mt-0">
              {children}
            </div>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
};

export default DashboardLayout;
