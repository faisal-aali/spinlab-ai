"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UploadModal from "../Dashboard/DashboardComponents/UploadVideoModal/UploadModal";
import AddNewPlayerModal from "../Dashboard/DashboardComponents/AddNewPlayerModal/AddNewPlayerModal";
import user from "@/util/user";

const Dashboard = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);

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
      <div className="bg-transparent primary-border py-16 px-8 rounded-lg text-center">
        <h2 className="text-5xl font-normal mb-8">Ready to enter the lab?</h2>
        <div className="flex justify-center mb-10">
          <button
            className="bg-primary text-black rounded w-36 h-8 flex items-center justify-center text-base"
            onClick={handleOpenModal}
            style={{ display: user.role === 'player' ? 'block' : 'none' }}
          >
            UPLOAD VIDEO
          </button>
          <button
            className="bg-primary text-black rounded w-36 h-8 flex items-center justify-center text-base ml-4"
            style={{ display: user.role === 'player' ? 'block' : 'none' }}
          >
            RECORD VIDEO
          </button>
          <button
            className="bg-primary text-black rounded w-48 h-8 flex items-center justify-center text-base ml-4"
            style={{ display: user.role === 'trainer' ? 'block' : 'none' }}
            onClick={() => setShowPlayerModal(true)}
          >
            ADD NEW PLAYER
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
      <AddNewPlayerModal open={showPlayerModal} onClose={() => setShowPlayerModal(false)} />
    </div>
  );
};

export default Dashboard;
