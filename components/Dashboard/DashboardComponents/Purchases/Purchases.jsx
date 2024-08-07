"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PickCredits from '@/components/Common/PickCredits/PickCredits'
import PaymentForm from "@/components/Common/PaymentForm/PaymentForm";
import { CircularProgress } from "@mui/material";
import axios from 'axios'
import { useApp } from "@/components/Context/AppContext";

const Purchases = () => {
  const userSession = useSession().data?.user
  const [step, setStep] = useState(1);
  const [credits, setCredits] = useState(null);
  const { user, fetchUser } = useApp()

  const calculateAmount = () => (
    ((!user.subscription.status || user.subscription.status !== 'active' ? credits * user.subscription.freePackage?.amountPerCredit : credits * user.subscription.package.amountPerCredit) / 100).toFixed(2)
  )

  return (
    <>
      <div className="flex-1">
        <div className="blueBackground p-8 primary-border rounded-lg flex items-center justify-between w-3/5 mb-4">
          <div className="flex flex-col ml-4 gap-5">
            <div>
              <h2 className="font-normal">
                Your Current Balance :
                <span className="ml-2 text-primary font-semibold">
                  {user?.credits.remaining}{" "}
                  <span className="text-zinc-400 text-base font-normal">
                    Credits
                  </span>
                </span>
              </h2>
            </div>
            <div>
              <p className="ml-1.5 text-zinc-400 text-xl false">
                Plan :
                <span className="ml-2 text-primary font-semibold">
                  {user?.subscription.package.name}
                </span>
              </p>
            </div>
          </div>
        </div>

        {!user ? <CircularProgress /> :
          <div className="p-4">
            {step === 1 && <PickCredits user={user} onSubmit={(credits) => {
              setCredits(credits)
              setStep(2)
            }} />}
            {step === 2 && <PaymentForm onBack={() => setStep(1)} onPaymentSuccess={() => setStep(3)} credits={credits} type='purchase' amount={calculateAmount()} />}
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
                    {user?.credits.remaining} <span className="text-zinc-400">Credits</span>
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
          </div>}
      </div>
    </>
  );
};

export default Purchases;
