"use client";
import React from "react";
import LandingPage from "./LandingPage";

const LandingPageWrapper = ({ showLanding }) => {
  if (!showLanding) return null;
  
  return <LandingPage />;
};

export default LandingPageWrapper;
