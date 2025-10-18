"use client";
import React from "react";
import { ToastProvider } from "../toaster/ToastContext";
import JoinOurTeam from "./JoinOurTeam";

const JoinOurTeamWrapper = () => {
  return (
    <ToastProvider>
      <JoinOurTeam />
    </ToastProvider>
  );
};

export default JoinOurTeamWrapper;
