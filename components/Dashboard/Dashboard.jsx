"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UploadModal from "../Dashboard/DashboardComponents/UploadVideoModal/UploadModal";
import AddNewPlayerModal from "../Dashboard/DashboardComponents/AddNewPlayerModal/AddNewPlayerModal";
import { useSession } from "next-auth/react";

const VideoSubmittedScreen = () => {
  return (
    <div className="flex flex-col gap-8 items-center mt-24">
      <div>
        <img src="/assets/success-large.svg" />
      </div>
      <div>
        <p className="text-4xl">Video submitted Succesfully!</p>
      </div>
      <div>
        <p className="text-lg">We've received the footage. Typically, results are emailed within 5 minutes.</p>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const user = useSession().data?.user || {}
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  const [videoSubmitted, setVideoSubmitted] = useState(false);

  const handleOpenModal = () => {
    setShowUploadModal(true);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
  };

  useEffect(() => {
    if (user.role === 'admin') router.replace('/profile')
  }, [user]);

  return (
    videoSubmitted ? <VideoSubmittedScreen /> :
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
            {/* <button
              className="bg-primary text-black rounded w-36 h-8 flex items-center justify-center text-base ml-4"
              onClick={handleOpenModal}
              style={{ display: user.role === 'player' ? 'block' : 'none' }}
            >
              RECORD VIDEO
            </button> */}
            <button
              className="bg-primary text-black rounded w-48 h-8 flex items-center justify-center text-base ml-4"
              style={{ display: user.role === 'trainer' ? 'block' : 'none' }}
              onClick={() => setShowPlayerModal(true)}
            >
              ADD NEW PLAYER
            </button>
            <button
              className="bg-primary text-black rounded w-48 h-8 flex items-center justify-center text-base ml-4"
              style={{ display: user.role === 'coach' ? 'block' : 'none' }}
              onClick={() => router.push('/users?role=player')}
            >
              VIEW PLAYERS
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
        <UploadModal open={showUploadModal} onClose={handleCloseModal} onSuccess={() => setVideoSubmitted(true)} />
        <AddNewPlayerModal open={showPlayerModal} onClose={() => setShowPlayerModal(false)} />
      </div>
  );
};

export default Dashboard;
