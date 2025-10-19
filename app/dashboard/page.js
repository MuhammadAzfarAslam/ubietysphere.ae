import GeneralForm from "@/components/form/GeneralForm";
import getData from "@/utils/getData";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import GeneralProfile from "@/components/upload/GeneralProfile";
import { redirect } from "next/navigation";
import DoctorApplicationCard from "@/components/list/DoctorApplicationCard";

export default async function DashboardPage() {
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
  let res;
  try {
    if(session?.user?.role === "admin") {
      res = await getData(`user/doctor-applications`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
    } else {
      res = await getData(`user/${session?.user?.id}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
    }

    console.log("res", res);

    return (
      <div className="space-y-6">
        {session?.user?.role === "admin" ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Doctor Applications</h2>
              <p className="text-gray-500">Review and manage doctor applications</p>
            </div>
            
            {res?.data?.content && res.data.content.length > 0 ? (
              <div className="space-y-4">
                {res.data.content.map((application) => (
                  <DoctorApplicationCard
                    key={application.id}
                    id={application.id}
                    firstName={application.firstName}
                    lastName={application.lastName}
                    email={application.email}
                    phone={application.phone}
                    totalExperience={application.totalExperience}
                    coverLetter={application.coverLetter}
                    resumeFileName={application.resumeFileName}
                    licenceFileName={application.licenceFileName}
                    lastUpdate={application.lastUpdate}
                    accessToken={session?.accessToken}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No doctor applications found.</p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center space-x-4">
              <GeneralProfile
                id={res?.data?.id}
                accessToken={session?.accessToken}
                preValue={
                  res?.data?.imageName !== null
                    ? `https://cms.ubietysphere.ae/img/user-images/${res?.data?.imageName}`
                    : "https://ubietysphere.ae/assets/images/placeholder-user.png"
                }
              />
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">General Info</h2>
                <p className="text-gray-500">Update your details below</p>
              </div>
            </div>

            <GeneralForm data={res?.data} accessToken={session?.accessToken} />
          </>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    // If it's a 401 error, the getData utility will handle the logout
    // For other errors, we can show an error message or redirect
    if (error.message?.includes("401")) {
      redirect("/login");
    }
    return <p>Error loading user data. Please try again.</p>;
  }
}