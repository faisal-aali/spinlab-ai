"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "../../components/Dashboard/Dashboard";

const DashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    const userSession = localStorage.getItem("userSession");
    if (!userSession) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
