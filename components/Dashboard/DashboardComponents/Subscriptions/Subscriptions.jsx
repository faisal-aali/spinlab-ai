"use client";

import { useState, useRef } from "react";
import PickYourPlan from '../../../Common/PickYourPlan/PickYourPlan'
import PickYourMembership from '../../../Common/PickYourMembership/PickYourMembership'
import PaymentForm from "@/components/Common/PaymentForm/PaymentForm";
import { useRouter } from "next/navigation";

const Subscriptions = () => {
  const router = useRouter()
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState(null);
  const [packageId, setPackageId] = useState(null);

  return (
    <div className="flex-1 py-8">
      <div className="p-4 flex items-center justify-between w-3/5 mb-4 -mt-16 h-32">
        <div className="flex gap-5 items-center">
          <div className="ml-4">
            <h2 className="font-normal">Change your Plan</h2>
            <p className="text-white text-base mt-2">Update your plan here.</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {step === 1 && <PickYourPlan onSubmit={(plan) => {
          setPlan(plan)
          setStep(2)
        }} />}
        {step === 2 && <PickYourMembership
          plan={plan}
          onSubmit={(packageId) => {
            setPackageId(packageId)
            setStep(3)
          }}
          onBack={() => setStep(1)}
        />}
        {step === 3 && <PaymentForm onPaymentSuccess={() => setStep(4)} packageId={packageId} type='subscription' />}
        {step === 4 && (
          <div className="text-center p-8 rounded-lg mx-auto">
            <div className="flex flex-col justify-center items-center h-full">
              <img
                src={'/assets/checkmark.png'}
                alt="Activated"
                className="w-24 h-24 mb-4"
              />
              <h2 className="text-white text-3xl mt-2 mb-4 font-semibold capitalize">
                Your {plan} Plan Activated!
              </h2>
              <button
                variant="contained"
                className="bg-white text-black font-bold px-12 py-1 rounded mt-4"
                onClick={() => router.replace('/dashboard')}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
