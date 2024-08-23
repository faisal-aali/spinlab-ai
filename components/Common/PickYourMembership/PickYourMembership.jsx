"use client";
import { useEffect, useState } from "react";
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import styles from "./PickYourMembership.module.css";
import { useApp } from "../../Context/AppContext";

const PickYourMembership = ({ plan, role, onBack, onSubmit }) => {
    const { user } = useApp();

    const [selectedPackage, setSelectedPackage] = useState('');
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/packages', {
            params: {
                role: role,
                plan: plan
            }
        }).then(res => setPackages(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSelectPackage = (_id) => {
        if (user?.subscription?.packageId !== _id) {
            setSelectedPackage(_id);
        }
    };

    return (
        <div className="w-full p-4 flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-white text-3xl mb-2">Pick your Membership</h2>
                <p className="text-primary">1 Credit = 1 Throw</p>
            </div>
            {loading ? (
                <div className="flex justify-center">
                    <CircularProgress />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8"> 
                    <div
                        className={`relative blueBackground p-8 flex flex-col items-center text-center cursor-pointer rounded-lg transition-all ${selectedPackage === "free" ? styles.selectedPlan : styles.planCard}`}
                        onClick={() => handleSelectPackage("free")}
                    >
                        {selectedPackage === "free" && (
                            <img
                                src={'/assets/checkmark.png'}
                                alt="Selected"
                                className="absolute top-4 right-4 w-8 h-8"
                            />
                        )}
                        <div className="py-4">
                            <h3 className="text-white text-xl mb-2">Free Plan</h3>
                            <p className="text-green-400 text-3xl font-bold mb-2">
                                $0/mth
                            </p>
                            <p className="text-white">Limited Access</p>
                            <ul className="text-left text-white mt-4">
                                <li className="mb-2 flex items-center">
                                    <img src="/assets/checkmark.png" alt="Checkmark" className="w-4 h-4 mr-2" />
                                    Access to basic drills
                                </li>
                                <li className="mb-2 flex items-center">
                                    <img src="/assets/checkmark.png" alt="Checkmark" className="w-4 h-4 mr-2" />
                                    Limited video library
                                </li>
                                <li className="mb-2 flex items-center">
                                    <img src="/assets/checkmark.png" alt="Checkmark" className="w-4 h-4 mr-2" />
                                    5 free throws per month
                                </li>
                            </ul>
                        </div>
                        <button
                            className="mt-4 w-full bg-green-500 text-black font-bold py-2 rounded-lg hover:bg-green-600 transition-all"
                            onClick={() => onSubmit({ _id: "free", name: "Free Plan", amount: 0 })}
                            disabled={!selectedPackage}
                        >
                            Get started
                        </button>
                    </div>
                    {packages.map((_package, index) => (
                        <div
                            key={index}
                            className={`relative blueBackground p-8 flex flex-col items-center text-center cursor-pointer rounded-lg transition-all ${selectedPackage === _package._id ? styles.selectedPlan : styles.planCard}
                                ${user?.subscription?.packageId === _package._id ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => handleSelectPackage(_package._id)}
                        >
                            {selectedPackage === _package._id && (
                                <img
                                    src={'/assets/checkmark.png'}
                                    alt="Selected"
                                    className="absolute top-4 right-4 w-8 h-8"
                                />
                            )}
                            <div className="py-4">
                                <h3 className="text-white text-xl mb-2">{_package.name}</h3>
                                <p className="text-green-400 text-3xl font-bold mb-2">
                                    ${_package.amount / 100}/mth
                                </p>
                                <p className="text-white">Billed annually.</p>
                                <ul className="text-left text-white mt-4">
                                    <li className="mb-2 flex items-center">
                                        <img src="/assets/checkmark.png" alt="Checkmark" className="w-4 h-4 mr-2" />
                                        All items on the drill library available
                                    </li>
                                    <li className="mb-2 flex items-center">
                                        <img src="/assets/checkmark.png" alt="Checkmark" className="w-4 h-4 mr-2" />
                                        Lorem ipsum demoar siet
                                    </li>
                                    <li className="mb-2 flex items-center">
                                        <img src="/assets/checkmark.png" alt="Checkmark" className="w-4 h-4 mr-2" />
                                        Credits are available at ${_package.amountPerCredit / 100}/credit
                                    </li>
                                    {_package.throwsPerMonth && (
                                        <li className="mb-2 flex items-center">
                                            <img src="/assets/checkmark.png" alt="Checkmark" className="w-4 h-4 mr-2" />
                                            {_package.throwsPerMonth} throws per month
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <button
                                className="mt-4 w-full bg-green-500 text-black font-bold py-2 rounded-lg hover:bg-green-600 transition-all"
                                onClick={() => onSubmit(packages.find(p => p._id === selectedPackage))}
                                disabled={!selectedPackage}
                            >
                                Get started
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className="flex justify-end mt-8">
                {onBack && (
                    <button
                        className="bg-white text-black font-bold px-4 py-2 rounded mr-4"
                        onClick={onBack}
                    >
                        BACK
                    </button>
                )}
            </div>
        </div>
    );
};

export default PickYourMembership;
