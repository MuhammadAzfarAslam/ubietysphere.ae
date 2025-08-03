import GeneralForm from "@/components/form/GeneralForm";
import getData from "@/utils/getData";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import GeneralProfile from "@/components/upload/GeneralProfile";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const res = await getData(`user/${session?.user?.id}`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  console.log("res", res);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <GeneralProfile
          id={res?.data?.id}
          accessToken={session?.accessToken}
          preValue={
            `https://cms.ubietysphere.ae/img/user-images/${res?.data?.imageName}` ||
            "https://ubietysphere.ae/assets/images/placeholder-user.png"
          }
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">General Info</h2>
          <p className="text-gray-500">Update your details below</p>
        </div>
      </div>

      <GeneralForm data={res?.data} accessToken={session?.accessToken} />
    </div>
  );
}
