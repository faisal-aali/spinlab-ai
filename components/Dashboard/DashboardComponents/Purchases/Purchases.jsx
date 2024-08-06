"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import PickCredits from '@/components/Common/PickCredits/PickCredits'
import PaymentForm from "@/components/Common/PaymentForm/PaymentForm";

const Purchases = () => {
  const userSession = useSession().data?.user
  const [step, setStep] = useState(1);
  const [credits, setCredits] = useState(null);

  return (
    <>
      <div className="flex-1">
        <div className="blueBackground p-8 primary-border rounded-lg flex items-center justify-between w-3/5 mb-4">
          <div className="flex flex-col ml-4 gap-5">
            <div>
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
            <div>
              <p className="ml-1.5 text-zinc-400 text-xl false">
                Membership Type :
                <span className="ml-2 text-primary font-semibold">
                  {userSession?.membership}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          {step === 1 && <PickCredits onSubmit={(credits) => {
            setCredits(credits)
            setStep(2)
          }} />}
          {step === 2 && <PaymentForm onPaymentSuccess={() => setStep(3)} credits={credits} type='purchase' />}
          {step === 3 && (
            <>
              <div className="text-center p-8 primary-border rounded-lg dark-blue-background w-4/6 mx-auto h-450 flex flex-col justify-center items-center">
                <h2 className="text-primary text-3xl mb-4 font-semibold border-b border-solid pb-4">
                  Purchase Successful!
                </h2>
                <p className="text-3xl mb-2 text-white">
                  Your Current Balance
                </p>
                <p className="text-5xl mb-6 text-primary">
                  {credits} <span className="text-zinc-400">Credits</span>
                </p>
                <button
                  variant="contained"
                  className="bg-white dark-blue-color px-12 mt-4 py-1 rounded font-bold"
                  onClick={() => setStep(1)}
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
