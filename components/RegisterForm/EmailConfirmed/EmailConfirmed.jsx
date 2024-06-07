"use client";
import React from "react";

const EmailConfirmed = ({ nextStep }) => {
  return (
    <div className="flex items-center justify-center bg-transparent RegisterFormWidth border primary-border py-16 px-8 rounded-lg w-full">
      <div className="w-full max-w-md p-8">
        <h2 className="text-white mb-4 text-center text-3xl	">
          Email Confirmed
        </h2>
        <p className="text-zinc-400 text-center mb-8">
          Continue to finish setting up your account.
        </p>
        <button
          className="w-full bg-green-500 bg-primary rounded-lg text-black font-normal py-3 rounded hover-shadow focus:outline-none"
          onClick={nextStep}
        >
          CONTINUE: SELECT PLAN
        </button>
      </div>
    </div>
  );
};

export default EmailConfirmed;
