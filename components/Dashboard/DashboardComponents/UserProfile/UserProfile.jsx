"use client"

import { Icon, IconButton, SvgIcon } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import EditUserModal from "../EditUserModal/EditUserModal";
import DeleteUserModal from "../DeleteUserModal/DeleteUserModal";
import user from "@/util/user";

const UserProfile = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const role = searchParams.get('role')

    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    return (
        <div className="flex flex-col mt-10 gap-10">
            <div>
                <IconButton className="border primary-border-parrot rounded" onClick={() => router.back()}>
                    <img src="/assets/back-icon.svg" />
                </IconButton>
            </div>
            <div className="max-w-4xl w-full">
                <div className=" p-8 rounded-2xl flex items-start" style={{ background: "linear-gradient(115.84deg, #32E100 -127.95%, #090F21 66.31%)", }} >
                    <div className=" mr-4">
                        <img
                            src="/assets/player.png"
                            alt="James Anderson"
                            className="rounded-lg"
                            style={{ height: "429px", width: "304px", objectFit: 'cover' }}
                        />
                    </div>
                    <div className="flex-1">
                        <div
                            className="flex justify-between items-center mb-2 rounded-lg p-4"
                            style={{ background: "#32E1004D", padding: "11px 12px" }}
                        >
                            <h2 className="text-4xl font-normal">James Anderson</h2>
                            <div className={`flex gap-4 ${user.role !== 'admin' && 'hidden'}`}>
                                <button onClick={() => setShowEditModal(true)} className="bg-white flex justify-center items-center w-12 text-green-600 rounded-lg p-2 focus:outline-none">
                                    <img src="/assets/edit-icon.svg" alt="" />
                                </button>
                                <button onClick={() => setShowDeleteModal(true)} className="bg-red-500 flex justify-center items-center w-12 rounded-lg p-2 focus:outline-none">
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
                            <button className="bg-primary dark-blue-color rounded w-40 h-9 flex items-center justify-center text-lg font-bold rounded-lg">
                                VIEW UPLOADS
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <EditUserModal open={showEditModal} onClose={() => setShowEditModal(false)} role={role} />
            <DeleteUserModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
        </div>
    );
};

export default UserProfile;
