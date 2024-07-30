"use client"

import { IconButton } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditUserModal from "../EditUserModal/EditUserModal";
import DeleteUserModal from "../DeleteUserModal/DeleteUserModal";
import GiftUserModal from "../GiftUserModal/GiftUserModal";
import { useSession } from "next-auth/react";
import Metrics from "../Metrics/Metrics";
import History from "../History/History";
import PlayersHistory from "../PlayersHistory/PlayersHistory";

const PlayerProfile = () => {

    const user = useSession().data?.user || {}
    const router = useRouter()
    const searchParams = useSearchParams()
    const userId = searchParams.get('id');
    const role = searchParams.get('role')
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showGiftModal, setShowGiftModal] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/users`, { params: { id: userId } });
                setUserData(response.data[0]);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);


    const handleEditClick = (userId) => {
      setSelectedUserId(userId);
      setShowEditModal(true);
    };


    const convertHeightToFeetAndInches = (heightInCm) => {
        if (!heightInCm) return { feet: "N/A", inch: "N/A", string: "N/A" };
        const heightInInches = heightInCm / 2.54;
        const feet = Math.floor(heightInInches / 12);
        const inches = Math.round(heightInInches % 12);
        return {
            feet,
            inch: inches,
            string: `${feet}ft ${inches} in`
        };
    };
    
    const heightData = userData?.roleData ? convertHeightToFeetAndInches(userData.roleData.height) : { feet: "N/A", inch: "N/A", string: "N/A" };


    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <div className="flex-col lg:flex-row max-w-4xl gap-4 p-8 rounded-2xl flex items-start" style={{ background: "linear-gradient(115.84deg, #32E100 -127.95%, #090F21 66.31%)", }} >
                <div>
                    <img
                        src="/assets/player-large.png"
                        alt="James Anderson"
                        className="rounded-lg"
                        style={{ height: "429px", width: "304px", objectFit: 'cover' }}
                    />
                </div>
                <div className="flex-1">
                    <div
                        className="flex justify-between items-center mb-2 rounded-lg p-4 gap-4"
                        style={{ background: "#32E1004D", padding: "11px 12px" }}
                    >
                        <h2 className="text-4xl font-normal capitalize">{userData.name || "User Name"}</h2>
                        <div className={`flex gap-4 ${user.role !== 'admin' && 'hidden'}`}>
                            <button onClick={() => handleEditClick(userData._id)} className="bg-white flex justify-center items-center w-12 text-green-600 rounded-lg p-2 focus:outline-none">
                                <img src="/assets/edit-icon.svg" alt="" />
                            </button>
                            <button onClick={() => setShowDeleteModal(true)} className="button-danger flex justify-center items-center w-12 rounded-lg p-2 focus:outline-none">
                                <img src="/assets/delete-icon-white.svg" alt="" />
                            </button>
                        </div>
                    </div>
                    <p className="text-base mb-2 pb-4 pt-2 border-b border-solid primary-border-color font-bold	">
                        Email: <span className="font-normal">{userData.email || "N/A"}</span>
                    </p>
                    <div className="flex flex-col lg:flex-row">
                        <p className="flex-1 text-base mb-2 pb-4 pt-2 border-b border-solid primary-border-color font-bold	">
                            Age: <span className="text-primary">{userData.age || "N/A"}</span>
                        </p>
                        <p className="flex-1 text-base mb-2 pb-4 pt-2 border-b border-solid primary-border-color font-bold	">
                            Location: <span className="text-primary">{userData.location || "N/A"}</span>
                        </p>
                    </div>
                    <div className="flex flex-col lg:flex-row">
                        <p className="flex-1 text-base mb-2 pb-4 pt-2 border-b border-solid primary-border-color font-bold	">
                            Height: <span className="text-primary">{heightData.string || "N/A"}</span>
                        </p>
                        <p className="flex-1 text-base mb-2 pb-4 pt-2 border-b border-solid primary-border-color font-bold	">
                            Weight: <span className="text-primary">{userData.roleData.weight || "N/A"} lbs</span>
                        </p>
                    </div>
                    <p className="text-base mb-2 pb-4 pt-2 border-b border-solid primary-border-color font-bold	">
                        Joining Date: <span className="text-primary">{userData.joiningDate || "N/A"}</span>
                    </p>
                    <p className="text-base mb-2 pb-4 pt-2 border-b border-solid primary-border-color font-bold	">
                        Remaining Credits: <span className="text-primary">{userData.credits || "N/A"}</span>
                    </p>
                    <p className="text-base mb-2 pb-4 pt-2 font-bold	">
                        Subscription Plan: <span className="text-primary">{userData.plan || "N/A"}</span>
                    </p>
                    <div className="flex justify-end">
                        <button onClick={() => setShowGiftModal(true)} className="bg-primary dark-blue-color rounded w-40 h-9 flex items-center justify-center text-lg font-bold rounded-lg hover-button-shadow">
                            GIFT CREDITS
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <Metrics omitPlayerCard={true} />
            </div>
            <EditUserModal open={showEditModal} onClose={() => setShowEditModal(false)} role={role} userData={userData} />
            <DeleteUserModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
            <GiftUserModal open={showGiftModal} onClose={() => setShowGiftModal(false)} />
        </div>
    );
}

const TrainerProfile = () => {

    const user = useSession().data?.user || {}
    const router = useRouter()
    const searchParams = useSearchParams()

    const role = searchParams.get('role')

    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showGiftModal, setShowGiftModal] = useState(false)

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col lg:flex-row max-w-4xl gap-4 p-8 rounded-2xl items-start" style={{ background: "linear-gradient(115.84deg, #32E100 -127.95%, #090F21 66.31%)", }} >
                <div>
                    <img
                        src="/assets/player-large.png"
                        alt="James Anderson"
                        className="rounded-lg"
                        style={{ height: "429px", width: "304px", objectFit: 'cover' }}
                    />
                </div>
                <div className="flex-1">
                    <div
                        className="flex justify-between items-center mb-2 rounded-lg p-4 gap-4"
                        style={{ background: "#32E1004D", padding: "11px 12px" }}
                    >
                        <h2 className="text-4xl font-normal">James Anderson</h2>
                        <div className={`flex gap-4 ${user.role !== 'admin' && 'hidden'}`}>
                            <button onClick={() => setShowEditModal(true)} className="bg-white flex justify-center items-center w-12 text-green-600 rounded-lg p-2 focus:outline-none">
                                <img src="/assets/edit-icon.svg" alt="" />
                            </button>
                            <button onClick={() => setShowDeleteModal(true)} className="button-danger flex justify-center items-center w-12 rounded-lg p-2 focus:outline-none">
                                <img src="/assets/delete-icon-white.svg" alt="" />
                            </button>
                        </div>
                    </div>
                    <p className="text-base mb-2 pb-4 pt-2 border-b border-solid primary-border-color font-bold	">
                        Email: <span className="font-normal">faisalali.us@gmail.com</span>
                    </p>
                    <p className="text-base mb-2 pb-4 pt-2 border-b border-solid primary-border-color font-bold	">
                        Joining Date: <span className="text-primary">05/03/2024</span>
                    </p>
                    <p className="text-base mb-2 pb-4 pt-2 border-b border-solid primary-border-color font-bold	">
                        Expiry Date: <span className="text-primary">05/03/2024</span>
                    </p>
                    <p className="text-base mb-2 pb-4 pt-2 border-b border-solid primary-border-color font-bold	">
                        Remaining Credits: <span className="text-primary">60</span>
                    </p>
                    <p className="text-base mb-2 pb-4 pt-2 font-bold	">
                        Subscription Plan: <span className="text-primary">Monthly/Yearly/One time user</span>
                    </p>
                    <div className="flex justify-end">
                        <button onClick={() => setShowGiftModal(true)} className="bg-primary dark-blue-color rounded w-40 h-9 flex items-center justify-center text-lg font-bold rounded-lg">
                            GIFT CREDITS
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <h3>Videos Uploaded</h3>
            </div>
            <div>
                <History omitHeader />
            </div>
            <div>
                <h3>Players</h3>
            </div>
            <div className="-mt-8">
                <PlayersHistory omitHeader />
            </div>
            <EditUserModal open={showEditModal} onClose={() => setShowEditModal(false)} role={role} />
            <DeleteUserModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
            <GiftUserModal open={showGiftModal} onClose={() => setShowGiftModal(false)} />
        </div>
    );
}

const StaffProfile = () => {

    const user = useSession().data?.user || {}
    const router = useRouter()
    const searchParams = useSearchParams()

    const role = searchParams.get('role')

    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    return (
        <div>
            <div className="flex-col lg:flex-row gap-4 max-w-4xl p-8 rounded-2xl flex items-start" style={{ background: "linear-gradient(115.84deg, #32E100 -127.95%, #090F21 66.31%)", }} >
                <div>
                    <img
                        src="/assets/player-large.png"
                        alt="James Anderson"
                        className="rounded-lg"
                        style={{ height: "429px", width: "304px", objectFit: 'cover' }}
                    />
                </div>
                <div className="flex-1">
                    <div
                        className="flex justify-between items-center mb-2 rounded-lg p-4 gap-4"
                        style={{ background: "#32E1004D", padding: "11px 12px" }}
                    >
                        <h2 className="text-4xl font-normal">James Anderson</h2>
                        <div className={`flex gap-4 ${user.role !== 'admin' && 'hidden'}`}>
                            <button onClick={() => setShowEditModal(true)} className="bg-white flex justify-center items-center w-12 text-green-600 rounded-lg p-2 focus:outline-none">
                                <img src="/assets/edit-icon.svg" alt="" />
                            </button>
                            <button onClick={() => setShowDeleteModal(true)} className="button-danger flex justify-center items-center w-12 rounded-lg p-2 focus:outline-none">
                                <img src="/assets/delete-icon-white.svg" alt="" />
                            </button>
                        </div>
                    </div>
                    <p className="text-base mb-2 pb-4 pt-2 border-b border-solid primary-border-color font-bold	">
                        Email: <span className="font-normal">faisalali.us@gmail.com</span>
                    </p>
                    <p className="text-base mb-2 pb-4 pt-2 border-b border-solid primary-border-color font-bold	">
                        Joining Date: <span className="text-primary">05/03/2024</span>
                    </p>
                    <p className="text-base mb-2 pb-4 pt-2 border-b border-solid primary-border-color font-bold	">
                        Expiry Date: <span className="text-primary">05/03/2024</span>
                    </p>
                    <p className="text-base mb-2 pb-4 pt-2 border-b border-solid primary-border-color font-bold	">
                        Remaining Credits: <span className="text-primary">60</span>
                    </p>
                    <p className="text-base mb-2 pb-4 pt-2 font-bold	">
                        Subscription Plan: <span className="text-primary">Monthly/Yearly/One time user</span>
                    </p>
                    {/* <div className="flex justify-end">
                        <button className="bg-primary dark-blue-color rounded w-40 h-9 flex items-center justify-center text-lg font-bold rounded-lg">
                            VIEW UPLOADS
                        </button>
                    </div> */}
                </div>
            </div>
            <EditUserModal open={showEditModal} onClose={() => setShowEditModal(false)} role={role} />
            <DeleteUserModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
        </div>
    );
}

const UserProfile = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const role = searchParams.get('role')

    return (

        <div className="flex flex-col mt-10 gap-10">
            <div className="w-fit border primary-border-parrot rounded">
                <IconButton onClick={() => router.back()}>
                    <img src="/assets/back-icon.svg" />
                </IconButton>
            </div>
            <div>
                {role === 'player' ? <PlayerProfile /> :
                    role === 'trainer' ? <TrainerProfile /> :
                        role === 'staff' ? <StaffProfile /> : <></>
                }
            </div>
        </div>
    );
};

export default UserProfile;
