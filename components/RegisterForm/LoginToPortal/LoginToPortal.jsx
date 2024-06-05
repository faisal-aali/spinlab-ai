"use client";
import React from "react";
import Link from 'next/link';

const LoginToPortal = ({ nextStep }) => {
  return (
    <div className="bg-transparent border primary-border rounded-lg max-w-lg">
      <div className="py-8">
        <h2 className="text-4xl mb-2 text-center"> Welcome to the</h2>
        <h3 className="text-primary mb-4 text-4xl text-center">SpinLabAi</h3>
        <p className="text-zinc-400 text-center  px-4 mb-6">
          Thank you for choosing SpinLabAi to bring biomechanics into your
          player development routine. Make sure to follow us on Twitter and
          Instagram (@spinlabai) and tag us in your posts.
        </p>
        <div className="text-center px-5 mt-8">
        <Link href="/login">
          <button
            type="submit"
            className="bg-primary rounded-lg w-full text-black font-normal px-3 py-3 rounded hover-shadow focus:outline-none"
          >
            LOG IN TO THE WEB PORTAL
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginToPortal;
