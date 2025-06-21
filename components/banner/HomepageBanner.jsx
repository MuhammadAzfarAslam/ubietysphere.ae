import React from "react";

const HomepageBanner = () => {
  return (
    <div>
      {/* Banner Section */}
      <div
        className="relative lg:h-[calc(100vh-108px)] h-[400px]  bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/images/bg1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-0 z-20"></div>{" "}
        {/* Optional overlay for readability */}
        <div className="max-w-7xl container mx-auto flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 relative z-30">
          {/* Left Column */}
          <div className="lg:w-1/2"></div> {/* Empty column */}
          {/* Right Column */}
          <div className="lg:w-1/2 text-black">
            <h1 className="text-4xl font-semibold mb-4">Get in Touch</h1>
            <p className="text-lg mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
              vehicula leo a ipsum venenatis, in auctor erat laoreet.
            </p>
            <a
              href="#contact"
              className="text-lg text-primary-light border-b border-transparent hover:border-white"
            >
              Find More
            </a>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default HomepageBanner;
