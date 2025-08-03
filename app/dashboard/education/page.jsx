import React from "react";
import Education from "@/wrappers/Education";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getData from "@/utils/getData";

const EducationPage = async () => {
  const session = await getServerSession(authOptions);

  const res = await getData("user/qualifications", {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  console.log("res", res);
  

  return (
    <div>
      <Education data={res?.data} accessToken={session?.accessToken} id={session?.sub} />
    </div>
  );
};

export default EducationPage;
