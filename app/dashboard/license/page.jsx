import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getData from "@/utils/getData";
import License from "@/wrappers/License";

const LicensePage = async () => {
  const session = await getServerSession(authOptions);

  const res = await getData("user/licences", {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  console.log("licences res", res);
  

  return (
    <div>
      <License data={res?.data} accessToken={session?.accessToken} id={session?.sub} />
    </div>
  );
};

export default LicensePage;
