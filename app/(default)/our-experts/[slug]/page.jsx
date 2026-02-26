import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import TeamCard from "@/components/cards/TeamCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getData from "@/utils/getData";
import { slugToTitle } from "@/utils/general";

const ExpertDetailPage = async ({ params }) => {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  const res = await getData(`doctor/by-professions?slug=${slug}`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  console.log("res expert page", res);

  return (
    <>
      <Breadcrumb title="Meet Our Experts">
        <span>/</span>
        <span className="text-primary-light font-medium capitalize">
          Our {slugToTitle(slug)}
        </span>
      </Breadcrumb>
      <section className="relative bg-primary-light py-16">
        {/* White Overlay */}
        <div className="absolute inset-0 bg-white opacity-100 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto text-center px-2 lg:px-16">
          <p className="text-sm font-bold text-primary mb-2">Team Members</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Our Professional Team
          </h2>
          <p className="text-base text-gray-700 mb-6 max-w-2xl mx-auto">
            Explore the diverse backgrounds and expertise of our licensed
            professionals, each committed to providing personalized care and
            guidance to support your mental health and well-being.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-12">
            {res?.data?.content?.map(
              ({ id, firstName, lastName, imageName, slug: doctorSlug, totalExperience }) => (
                <TeamCard
                  key={id}
                  title={`Dr. ${firstName} ${lastName}`}
                  designation={slugToTitle(slug)}
                  slug={doctorSlug}
                  service={slug}
                  totalExperience={totalExperience}
                  imageURL={
                    imageName !== null
                      ? `https://cms.ubietysphere.ae/img/user-images/${imageName}`
                      : `${process.env.NEXT_PUBLIC_URL}assets/images/placeholder-user.png`
                  }
                />
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ExpertDetailPage;
