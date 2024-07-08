"use client";

import { useState } from "react";
import { Button } from "@mui/material";
import styles from "./Subscription.module.css";

const Subscriptions = () => {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const checkmark = '/assets/checkmark.png'; 

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const handleContinue = () => {
    if (selectedPlan) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <>
      <div className="flex-1 py-8">
        <div className="p-4 flex items-center justify-between w-3/5 mb-4 h-32">
          <div className="flex gap-5 items-center">
            <div className="ml-4">
              <h2 className="font-normal">Change your Plan</h2>
              <p className="text-white text-base mt-2">Update your plan here.</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          {step === 1 && (
            <div className="">
              <div className="w-full p-4">
                <div className={`mb-6 ${styles.pricePlanContainer}`}>
                  {["Monthly", "Annual"].map((plan, index) => (
                    <div
                      key={index}
                      className={`relative p-4 mb-8 flex items-center gap-12 cursor-pointer border primary-border rounded-lg ${
                        selectedPlan === plan ? "hover-shadow-dark" : "hover-shadow-light"
                      }`}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      {selectedPlan === plan && (
                        <img
                          src={checkmark}
                          alt="Selected"
                          className="absolute -left-6 w-16 h-16"
                        />
                      )}
                      <div className={`blueBackground py-10 px-12 ${styles.pricePlan}`}>
                        <h3 className="text-white text-2xl mt-2">{plan}</h3>
                        <p className="text-primary text-3xl font-bold">
                          {plan === "Monthly" ? "$99.99" : "$460"}
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
                <button
                    className="bg-white dark-blue-color px-4 py-1 rounded font-bold"
                  >
                    Back
                  </button>
                  <button
                    className={`px-4 py-1 rounded font-bold ${
                      selectedPlan ? "bg-primary dark-blue-color" : "bg-primary-light dark-blue-color"
                    }`}
                    onClick={handleContinue}
                    disabled={!selectedPlan}
                  >
                    CONTINUE
                  </button>
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="text-center p-8 rounded-lg mx-auto">
              <div className="flex flex-col justify-center items-center h-full">
                <img
                  src={checkmark}
                  alt="Activated"
                  className="w-24 h-24 mb-4"
                />
                <h2 className="text-white text-3xl mt-2 mb-4 font-semibold">
                  {selectedPlan} Plan Activated!
                </h2>
                <button
                  variant="contained"
                  className="bg-white text-black font-bold px-12 py-1 rounded mt-4"
                  onClick={handleBack}
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Subscriptions;
