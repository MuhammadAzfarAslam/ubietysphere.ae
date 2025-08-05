"use client";
import React, { useState, useEffect } from "react";
import GeneralButton from "../button/GeneralButton";

const LandingPage = () => {
  const [showLanding, setShowLanding] = useState(true);

  // Function to get cookie value by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Function to set a cookie
  const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000); // 1 day expiration
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  // Function to remove a cookie
  const deleteCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  };

  // Check if the landing page has been shown before
  //   useEffect(() => {
  //     const landingPageSeen = getCookie("landingPageSeen");
  //     if (landingPageSeen) {
  //       setShowLanding(false); // Hide if cookie exists
  //     }
  //   }, []);

  useEffect(() => {
    // Listen for the 'beforeunload' event to remove the cookies when the user closes the tab
    const handleBeforeUnload = () => {
      deleteCookie("landingPageSeen");
      deleteCookie("userSelection");
    };

    // Attach event listener for page unload (close or refresh)
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Handle selection and set cookies
  const handleSelection = (selection) => {
    setCookie("landingPageSeen", "true", 1); // Set cookie for 1 day
    setCookie("userSelection", selection, 1); // Store user's selection
    if (selection === "health") {
      setShowLanding(false); // Close the landing page
    } else if (selection === "lms") {
      window.location.href = "https://lms.ubietysphere.ae"; // Redirect to LMS
    }
  };

  // Don't render anything if `showLanding` is false
  if (!showLanding) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden z-50"
      style={{
        zIndex: 9999, // Explicitly set high z-index to avoid overlap
      }}
    >
      <div className="flex h-screen">
        {/* Left Column with Overlay */}
        <div
          className="w-1/2 h-full bg-cover bg-center flex flex-col justify-center items-center relative"
          style={{ backgroundImage: "url('/path-to-your-image-1.jpg')" }}
        >
          <div className="absolute inset-0 bg-[#5ad1ba] bg-opacity-50"></div>{" "}
          {/* Overlay */}
          <h2 className="text-white text-3xl font-semibold z-10 pb-4">
            Option Health
          </h2>
          <GeneralButton
            additionalClass="w-32"
            onClick={() => handleSelection("health")}
          >
            Visit
          </GeneralButton>
        </div>

        {/* Right Column with Overlay */}
        <div
          className="w-1/2 h-full bg-cover bg-center flex flex-col justify-center items-center relative"
          style={{ backgroundImage: "url('/path-to-your-image-2.jpg')" }}
        >
          <div className="absolute inset-0 bg-secondary bg-opacity-50"></div>{" "}
          {/* Overlay */}
          <h2 className="text-black text-3xl font-semibold z-10 pb-4">
            Option LMS
          </h2>
          <GeneralButton
            additionalClass="w-32"
            onClick={() => handleSelection("lms")}
          >
            Visit
          </GeneralButton>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
