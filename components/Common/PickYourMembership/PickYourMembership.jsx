"use client";

import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import axios from 'axios'
import { useSession } from "next-auth/react";
import styles from "./PickYourMembership.module.css";


const PickYourMembership = ({ plan, onBack, onSubmit }) => {
    const user = useSession().data?.user || {}

    const [selectedPackage, setSelectedPackage] = useState('')
    const [packages, setPackages] = useState([]);

    useEffect(() => {
        axios.get('/api/packages', {
            params: {
                role: user.role,
                plan: plan
            }
        }).then(res => setPackages(res.data)).catch(console.error)
    }, [])

    return (
        <div>
            <div className="w-full p-4">
                <div className={`mb-6 ${styles.pricePlanContainer}`}>
                    {packages.map((_package, index) => (
                        <div
                            key={index}
                            className={`relative p-4 mb-8 flex items-center gap-12 cursor-pointer border primary-border rounded-lg ${selectedPackage === _package._id ? "hover-shadow-dark" : "hover-shadow-light"
                                }`}
                            onClick={() => setSelectedPackage(_package._id)}
                        >
                            {selectedPackage === _package._id && (
                                <img
                                    src={'/assets/checkmark.png'}
                                    alt="Selected"
                                    className="absolute -left-6 w-16 h-16"
                                />
                            )}
                            <div className={`blueBackground py-10 px-12 ${styles.pricePlan}`}>
                                <h3 className="text-white text-2xl mt-2">{_package.name}</h3>
                                <p className="text-primary text-3xl font-bold">
                                    ${_package.amount / 100}
                                </p>
                            </div>
                            <div>
                                <ul className="text-zinc-400">
                                    <li className="mb-4 text-white">
                                        <span className="text-primary">1. Performance Tracking:</span> Monitor player statistics and
                                        trends to identify strengths, weaknesses, and areas for
                                        improvement.
                                    </li>
                                    <li className="mb-4 text-white">
                                        <span className="text-primary">2. Tactical Insights:</span> Analyze gameplay patterns to
                                        optimize strategies and adapt game plans for competitive
                                        advantage.
                                    </li>
                                    <li className="mb-4 text-white">
                                        <span className="text-primary">3. Injury Prevention:</span> Utilize data to manage player
                                        workload, track fatigue levels, and reduce the risk of
                                        injuries through informed decision-making.
                                    </li>
                                    <li className="text-white">
                                        <span className="text-primary">4. Talent Development:</span> Identify promising players, track
                                        their progress, and tailor training programs to maximize
                                        their potential.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex space-x-4 justify-end mt-4">
                    {onBack &&
                        <button
                            className="bg-white text-black font-bold px-4 py-1 rounded"
                            onClick={onBack}
                        >
                            BACK
                        </button>
                    }
                    <button
                        className={`px-4 py-1 rounded font-bold bg-primary dark-blue-color hover-button-shadow`}
                        onClick={() => onSubmit(selectedPackage)}
                        disabled={!selectedPackage}
                    >
                        CONTINUE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PickYourMembership;
