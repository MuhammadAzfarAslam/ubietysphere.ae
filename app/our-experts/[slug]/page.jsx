import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import TeamCard from "@/components/cards/TeamCard";
import Image from "next/image";
import React from "react";

const ExpertDetailPage = () => {
  return (
    <>
      <Breadcrumb title="Meet Our Experts">
        <span>/</span>
        <span className="text-primary-light font-medium">
          Meet Our Therapists
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
            <TeamCard
              title="Dr. Jane Doe"
              designation="Senior Psychologist"
              imageURL="/assets/images/team1.jpg"
            />
            <TeamCard
              title="Mr. John Smith"
              designation="Junior Counselor"
              imageURL="/assets/images/team1.jpg"
            />
            <TeamCard title="Dr. Jane Doe" designation="Senior Psychologist" />
            <TeamCard title="Mr. John Smith" designation="Junior Counselor" />
            <TeamCard title="Mr. John Smith" designation="Junior Counselor" />
            <TeamCard title="Dr. Jane Doe" designation="Senior Psychologist" />
            <TeamCard title="Mr. John Smith" designation="Junior Counselor" />
            <TeamCard title="Dr. Jane Doe" designation="Senior Psychologist" />
          </div>
        </div>
      </section>
    </>
  );
};

export default ExpertDetailPage;
