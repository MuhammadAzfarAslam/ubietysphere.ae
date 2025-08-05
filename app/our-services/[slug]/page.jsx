import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import TeamCard from "@/components/cards/TeamCard";
import React from "react";

const KnowledgeDomePage = () => {
  return (
    <>
      <Breadcrumb title="Book An Appointment for Genetic Counseling">
        <span>/</span>
        <span className="text-primary-light font-medium">Book Appointment</span>
      </Breadcrumb>

      <section className="relative bg-primary-light py-16">
        {/* White Overlay */}
        <div className="absolute inset-0 bg-white opacity-90 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto text-center px-2 lg:px-16">
          <p className="text-sm font-bold text-primary mb-2">Team Members</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Our Genetic Counseling Team
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-12">
            <TeamCard title="Dr. Jane Doe" designation="Senior Psychologist" />
            <TeamCard title="Mr. John Smith" designation="Junior Counselor" />
            <TeamCard title="Dr. Jane Doe" designation="Senior Psychologist" />
            <TeamCard title="Mr. John Smith" designation="Junior Counselor" />
          </div>
        </div>
      </section>
    </>
  );
};

export default KnowledgeDomePage;
