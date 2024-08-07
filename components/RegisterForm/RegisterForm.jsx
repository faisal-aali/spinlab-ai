"use client";
import React, { useEffect, useState } from "react";
import SelectRole from "../../components/RegisterForm/SelectRole/SelectRole";
import EmailConfirmed from "../../components/RegisterForm/EmailConfirmed/EmailConfirmed";
import PickPlan from "../../components/RegisterForm/PickPlan/PickPlan";
import CreateAccount from "../../components/RegisterForm/CreateAccount/CreateAccount";
import OpenDashboard from "../../components/RegisterForm/OpenDashboard/OpenDashboard";
import StripeAccount from "../../components/RegisterForm/StripeAccount/StripeAccount";
import { useSearchParams } from "next/navigation";
import PickYourPlan from "../Common/PickYourPlan/PickYourPlan";
import PickYourMembership from "../Common/PickYourMembership/PickYourMembership";
import PaymentForm from "../Common/PaymentForm/PaymentForm";

const RegisterForm = () => {
  const searchParams = useSearchParams()

  const [step, setStep] = useState(1);
  const [values, setValues] = useState({
    firstName: searchParams.get('name')?.split(' ')[0],
    lastName: searchParams.get('name')?.split(' ')[1] || "",
    email: searchParams.get('email'),
    role: "",
    city: "",
    country: "",
    emailVerified: searchParams.get('emailVerified') || false,
    password: "",
    confirmPassword: "",
    plan: "",
    package: {}
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const setStepParam = params.get("set");
    if (setStepParam) {
      setStep(Number(setStepParam));
    }
  }, []);

  useEffect(() => {
    if (step === 3 && values.plan === "free") {
      nextStep();
    }
    if (step === 5 && values.plan === "free") {
      nextStep();
    }
  }, [step, values]);

  const handleChange = (field) => (e) => {
    console.log('handlechange called', field, e)
    setValues(v => ({ ...v, [field]: e.target.value }));
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center z-10 min-h-screen pt-8 pb-8">
      <div className="flex justify-center">
        <div
          className={`h-2 w-14 ${step === 1 ? "bg-primary" : "backgroundDisabledColor"
            } rounded-sm mr-2`}
        ></div>
        {/* <div
          className={`h-2 w-14 ${step === 2 ? "bg-primary" : "backgroundDisabledColor"
            } rounded-sm mr-2`}
        ></div> */}
        <div
          className={`h-2 w-14 ${step === 2 ? "bg-primary" : "backgroundDisabledColor"
            } rounded-sm mr-2`}
        ></div>
        <div
          className={`h-2 w-14 ${step === 3 ? "bg-primary" : "backgroundDisabledColor"
            } rounded-sm mr-2`}
        ></div>
        <div
          className={`h-2 w-14 ${step === 4 ? "bg-primary" : "backgroundDisabledColor"
            } rounded-sm mr-2`}
        ></div>
        <div
          className={`h-2 w-14 ${step === 5 ? "bg-primary" : "backgroundDisabledColor"
            } rounded-sm`}
        ></div>
        <div
          className={`h-2 w-14 ${step === 6 ? "bg-primary" : "backgroundDisabledColor"
            } rounded-sm`}
        ></div>
      </div>
      <div>
        {step === 1 && (
          <SelectRole
            nextStep={nextStep}
            handleChange={handleChange}
            values={values}
          />
        )}
        {/* {step === 2 && <EmailConfirmed nextStep={nextStep} />} */}
        {step === 2 && (
          <div className="bg-transparent border primary-border rounded-lg max-w-7xl">
            <PickPlan
              nextStep={nextStep}
              handleChange={handleChange}
              values={values}
            />
          </div>
        )}
        {step === 3 && values.plan !== "free" && (
          <div className="bg-transparent border primary-border rounded-lg max-w-7xl px-6">
            <h2 className="text-white text-3xl font-bold mb-2 text-center mt-4">
              Pick your membership
            </h2>
            <PickYourMembership
              plan={values.plan}
              role={values.role}
              onSubmit={(_package) => {
                handleChange("package")({ target: { value: _package } })
                nextStep()
              }}
            />
          </div>
        )}
        {step === 4 && (
          <CreateAccount
            nextStep={nextStep}
            values={values}
          />
        )}
        {step === 5 && values.plan !== "free" && (
          <PaymentForm onPaymentSuccess={() => setStep(6)} _package={values.package} type='subscription' />
        )}
        {step === 6 && <OpenDashboard />}
      </div>
    </div>
  );
};

export default RegisterForm;
