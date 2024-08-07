"use client";

import { useState, useEffect } from "react";
import PickYourPlan from '../../../Common/PickYourPlan/PickYourPlan';
import PickYourMembership from '../../../Common/PickYourMembership/PickYourMembership';
import PaymentForm from "@/components/Common/PaymentForm/PaymentForm";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { useSession } from "next-auth/react";

const Subscriptions = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState(null);
  const [_package, setPackage] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/users', { params: { id: session?.user._id } });
        const userData = response.data[0];
        setUser(userData);
        if (userData.subscription && userData.subscription.status === 'active') {
          setSubscription(userData.subscription);
          setStep(5);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (session?.user?._id) {
      fetchData();
    }
  }, [session]);

  const handleCancelSubscription = async () => {
    try {
      await axios.post('/api/subscriptions/cancel', { userId: user._id });
      setSubscription(null);
      setStep(1);
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

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
        {step === 1 && (
          <PickYourPlan
            onSubmit={(plan) => {
              setPlan(plan);
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <PickYourMembership
            plan={plan}
            onSubmit={(_package) => {
              setPackage(_package);
              setStep(3);
            }}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <PaymentForm
            onBack={() => setStep(2)}
            onPaymentSuccess={() => setStep(4)}
            _package={_package}
            type="subscription"
          />
        )}
        {step === 4 && (
          <div className="text-center p-8 rounded-lg mx-auto">
            <div className="flex flex-col justify-center items-center h-full">
              <img
                src="/assets/checkmark.png"
                alt="Activated"
                className="w-24 h-24 mb-4"
              />
              <h2 className="text-white text-3xl mt-2 mb-4 font-semibold capitalize">
                Your {plan} plan has been activated!
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
        {step === 5 && subscription && (
          <div className="text-center p-8 rounded-lg mx-auto">
            <div className="flex flex-col justify-center items-center h-full">
              <h2 className="text-white text-3xl mt-2 mb-4 font-semibold capitalize">
                Active Subscription: {subscription.package.name}
              </h2>
              <p className="text-white text-base mt-2">
                Status: {subscription.status}
              </p>
              <p className="text-white text-base mt-2">
                Amount: ${(subscription.amount / 100).toFixed(2)} {subscription.package.plan}
              </p>
              <button
                variant="contained"
                className="bg-white text-black font-bold px-12 py-1 rounded mt-4"
                onClick={handleCancelSubscription}
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
