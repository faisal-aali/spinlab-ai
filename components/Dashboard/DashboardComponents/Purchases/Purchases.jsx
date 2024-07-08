"use client";
import { useState } from "react";

const Purchases = () => {
  const [step, setStep] = useState(1);
  const [selectedCredits, setSelectedCredits] = useState(null);

  const handleSelectCredits = (credits) => {
    setSelectedCredits(credits);
  };

  const handleContinue = () => {
    if (selectedCredits) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  return (
    <>
      <div className="flex-1 py-8">
        <div className="blueBackground p-4 primary-border rounded-lg flex items-center justify-between w-3/5 mb-4 h-32">
          <div className="flex gap-5 items-center">
            <div className="ml-4">
              <h2 className="font-normal">
                Your Current Balance :
                <span className="ml-2 text-primary font-semibold">
                  07{" "}
                  <span className="text-zinc-400 text-base font-normal">
                    Credits
                  </span>
                </span>
              </h2>
            </div>
          </div>
        </div>

        <div className="p-4">
          {step === 1 && (
            <>
              <div>
                <h2 className="text-xl mb-6">
                  Save money and get free credits when you buy in bulk
                </h2>
              </div>
              <div className="flex flex-col	w-11/12">
                <div className="mb-6 flex gap-6">
                  {[50, 100, 150].map((credits, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center p-4 py-6 rounded-lg cursor-pointer basis-1/3 h-44 justify-center dark-blue-background ${
                        selectedCredits === credits
                          ? "hover-shadow-light-box"
                          : "border primary-border"
                      }`}
                      onClick={() => handleSelectCredits(credits)}
                    >
                      <h3 className="text-4xl mb-2">{credits} </h3>
                      <h4 className="text-zinc-400 text-base font-normal">
                        Credits
                      </h4>
                      <button
                        className={`font-bold px-8 py-1 rounded mt-4 ${
                          selectedCredits === credits
                            ? "bg-primary dark-blue-color"
                            : "bg-white dark-blue-color"
                        }`}
                      >
                        ${credits * 2}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-4 justify-end mt-4">
                  <button
                    className="bg-white dark-blue-color px-4 py-1 rounded font-bold"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className={`px-4 py-1 rounded font-bold ${
                      selectedCredits
                        ? "bg-primary dark-blue-color"
                        : "bg-primary-light dark-blue-color"
                    }`}
                    onClick={handleContinue}
                    disabled={!selectedCredits}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="text-center p-8 primary-border rounded-lg dark-blue-background w-4/6 mx-auto h-450 flex flex-col justify-center items-center">
                <h2 className="text-primary text-3xl mb-4 font-semibold border-b border-solid pb-4">
                  Purchase Successful!
                </h2>
                <p className="text-3xl mb-2 text-white">
                  Your Current Balance
                </p>
                <p className="text-5xl mb-6 text-primary">
                  {selectedCredits} <span className="text-zinc-400">Credits</span>
                </p>
                <button
                  variant="contained"
                  className="bg-white dark-blue-color px-12 mt-4 py-1 rounded font-bold"
                  onClick={handleBack}
                >
                  Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Purchases;
