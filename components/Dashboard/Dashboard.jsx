"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    console.log(userSession);
    if (userSession) {
      setUserEmail(userSession.email);
    } else if (!userSession) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="flex-1 p-8">
      <div className="blueBackground p-4 rounded-lg flex items-center space-x-4 w-3/5">
        <span className="text-2xl">👋</span>
        <div>
          <p className="text-xl font-semibold">Hello Faisal</p>
          <p className="text-zinc-400">
            Credits Available: <span className="text-green-500">10</span>
          </p>
        </div>
        <div className="flex space-x-4">
          <div className="bg-zinc-700 p-2 rounded-lg">
            <p className="text-zinc-400 text-sm">6'2"</p>
          </div>
          <div className="bg-zinc-700 p-2 rounded-lg">
            <p className="text-zinc-400 text-sm">200lbs</p>
          </div>
        </div>
      </div>
      <div className="bg-zinc-800 p-8 rounded-lg text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to enter the lab?</h2>
        <div className="flex justify-center space-x-4 mb-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
            UPLOAD VIDEO
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
            RECORD VIDEO
          </button>
        </div>
        <p className="text-zinc-400 mb-4">
          Discover essential formats and metrics for optimal video results
          before uploading/recording.
        </p>
        <a href="#" className="text-green-500">
          Click here!
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
