import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Image from "next/image";
import { services } from "../page";
import JoinOurTeamWrapper from "@/components/form/JoinOurTeamWrapper";

const ContactPage = () => {
  return (
    <>
      <Breadcrumb title="Join Our Team">
        <span>/</span>
        <span className="text-primary-light font-medium">Join Our Team</span>
      </Breadcrumb>

      <section className="contact-form relative bg-white py-16 px-3">
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-7xl mx-auto">
          {/* <div className="w-full md:w-2/5">
            <Image
              src={"https://ubietysphere.ae/assets/images/contact.jpg"}
              height={300}
              width={500}
              alt="contact image"
            />
          </div> */}
          {/* <div className="w-full md:w-3/5"> */}
          <div className="w-full">
            <JoinOurTeamWrapper />
          </div>
        </div>
      </section>

      {/* Services Section 3 */}
      <section className="services relative bg-primary-light py-16">
        {/* White Overlay */}
        <div className="absolute inset-0 bg-white opacity-90 pointer-events-none"></div>
        <div className="relative max-w-7xl pb-10 mx-auto text-center px-2 lg:px-16">
          <p className="text-sm font-bold text-primary mb-2">Explore</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Career Opportunities
          </h2>
          <p className="text-base text-gray-700 mb-6 max-w-2xl mx-auto">
            Discover your career at Intermountain Health where you’ll find
            inspiration, flexibility, employment stability, benefits, and a
            lifetime of challenging career opportunities.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, idx) => (
            <div
              key={idx}
              className="relative group p-6 rounded-2xl  bg-white overflow-hidden transition-all duration-500 shadow hover:shadow-lg"
            >
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-secondary scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-in-out rounded-2xl z-0" />

              {/* Content */}
              <div className="relative z-10">
                <div className="mb-4 text-3xl">{item.icon}</div>
                <h3 className="font-bold text-lg text-black transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-500 mt-2 text-sm transition-colors duration-300">
                  {item.description}
                </p>
                <div className="mt-4 font-bold text-primary transition-colors duration-300 inline-flex items-center gap-1">
                  Read More <span className="text-lg">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ContactPage;
