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
        console.log( "User packageId: ", user?.subscription?.packageId)
        console.log(packages )
        axios.get('/api/packages', {
            params: {
                role: role,
                plan: plan
            }
        }).then(res => setPackages(res.data))
          .catch(console.error)
          .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="w-4/5 mx-auto p-4">
                <div className="text-center mb-8">
                    <h2 className="text-white text-3xl mb-2">Pick your Membership</h2>
                    <p className="text-primary">1 Credit = 1 Throw</p>
                </div>
                {loading ? (
                    <div className="flex justify-center">
                        <CircularProgress />
                    </div>
                ) : (
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${styles.pricePlanContainer}`}>
                        {packages.map((_package, index) => (
                            <div
                                key={index}
                                className={`relative p-4 flex flex-col items-center text-center cursor-pointer blueBackground rounded-lg ${selectedPackage === _package._id ? "hover-shadow-dark" : "hover-shadow-light"
                                    } ${user?.subscription?.packageId === _package._id ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={() => {
                                    if (user?.subscription?.packageId !== _package._id) {
                                        setSelectedPackage(_package._id);
                                    }
                                }}
                            >
                                {selectedPackage === _package._id && (
                                    <img
                                        src={'/assets/checkmark.png'}
                                        alt="Selected"
                                        className="absolute top-4 right-4 w-8 h-8"
                                    />
                                )}
                                <div className={`py-8`}>
                                    <h3 className="text-white text-3xl mb-2">{_package.name}</h3>
                                    <p className="text-primary text-4xl font-bold">
                                        ${_package.amount / 100}
                                    </p>
                                    <p className="text-white mt-2">
                                        {_package.description}
                                    </p>
                                    <p className="text-white mt-2">
                                        {_package.throwsPerMonth
                                            ? `${_package.throwsPerMonth} throws per month & additional credits available at`
                                            : "Credits are available at"}
                                        <span className="text-primary"> ${_package.amountPerCredit / 100}/credit</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex space-x-4 justify-end mt-8">
                    {onBack && (
                        <button
                            className="bg-white text-black font-bold px-4 py-2 rounded"
                            onClick={onBack}
                        >
                            BACK
                        </button>
                    )}
                    <button
                        className={`px-4 py-2 rounded font-bold bg-primary dark-blue-color hover-button-shadow`}
                        onClick={() => onSubmit(packages.find(p => p._id === selectedPackage))}
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
