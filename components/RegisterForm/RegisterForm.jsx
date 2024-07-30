"use client";
import React, { useEffect, useState } from "react";
import SelectRole from "../../components/RegisterForm/SelectRole/SelectRole";
import EmailConfirmed from "../../components/RegisterForm/EmailConfirmed/EmailConfirmed";
import PickPlan from "../../components/RegisterForm/PickPlan/PickPlan";
import CreateAccount from "../../components/RegisterForm/CreateAccount/CreateAccount";
import LoginToPortal from "../../components/RegisterForm/LoginToPortal/LoginToPortal";
import StripeAccount from "../../components/RegisterForm/StripeAccount/StripeAccount";
import { useSearchParams } from "next/navigation";

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
    password: "",
    confirmPassword: "",
    plan: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const setStepParam = params.get("set");
    if (setStepParam) {
      setStep(Number(setStepParam));
    }
  }, []);

  useEffect(() => {
    if (step === 4 && values.plan === "free") {
      nextStep();
    }
  }, [step]);

  const handleChange = (field) => (e) => {
    console.log('handlechange called', field, e)
    setValues(v => ({ ...v, [field]: e.target.value }));
  };

  const handleSubmit = async (values) => {
    console.log("Submitting form with values:", values);
    await handleSubmitRegister(values);
  };

  const handleSubmitRegister = async (values) => {
    console.log(values);
    if (values) {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(values),
      });
      console.log(response);

      return response;
    }
    return null;
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const handlePaymentSuccess = () => {
    setStep(6);
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
          <PickPlan
            nextStep={nextStep}
            handleChange={handleChange}
            values={values}
          />
        )}
        {step === 3 && (
          <CreateAccount
            nextStep={nextStep}
            handleChange={handleChange}
            onSubmit={handleSubmit}
            values={values}
          />
        )}
        {step === 4 && values.plan !== "free" && (
          <StripeAccount
            nextStep={nextStep}
            onPaymentSuccess={handlePaymentSuccess}
            values={values}
          />
        )}
        {step === 5 && <LoginToPortal />}
      </div>
    </div>
  );
};

export default RegisterForm;
