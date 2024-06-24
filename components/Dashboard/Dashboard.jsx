"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UploadModal from "../Dashboard/DashboardComponents/UploadVideoModal/UploadModal";

const Dashboard = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleOpenModal = () => {
    setShowUploadModal(true);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
  };

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
    <div className="flex-1 py-8">
      <div className="blueBackground p-4 primary-border rounded-lg flex items-center justify-between w-3/5 mb-4 h-32">
        <div className="flex gap-5 items-center">
          <img src="/assets/hello-icon.png" className="w-11" alt="" />
          <div>
            <h2 className="font-normal">
              Hello <span className="font-semibold	">Faisal</span>
            </h2>
            <p className="text-zinc-400 text-sm	">
              Credits Available: <span className="text-primary">10</span>
            </p>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="primary-border-green flex items-center justify-center px-4 h-9 rounded-lg">
            <p className="text-white text-sm">6'2"</p>
          </div>
          <div className="primary-border-green flex items-center justify-center px-4 h-9 rounded-lg">
            <p className="text-white text-sm">200lbs</p>
          </div>
        </div>
      </div>
      <div className="bg-transparent primary-border py-16 px-8 rounded-lg text-center">
        <h2 className="text-5xl font-normal mb-8">Ready to enter the lab?</h2>
        <div className="flex justify-center mb-10">
          <button
            className="bg-primary text-black rounded w-36 h-8 flex items-center justify-center text-base"
            onClick={handleOpenModal}
          >
            UPLOAD VIDEO
          </button>
          <button className="bg-primary text-black rounded w-36 h-8 flex items-center justify-center text-base ml-4">
            RECORD VIDEO
          </button>
        </div>
        <p className="font-light text-sm mb-2">
          Discover essential formats and metrics for optimal video results
          before uploading/recording.
        </p>
        <a href="#" className="text-primary underline">
          Click here!
        </a>
      </div>
      <UploadModal open={showUploadModal} onClose={handleCloseModal} />
    </div>
  );
};

export default Dashboard;
