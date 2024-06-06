"use client";
import React, { useEffect, useState } from "react";
import SelectRole from "../../components/RegisterForm/SelectRole/SelectRole";
import EmailConfirmed from "../../components/RegisterForm/EmailConfirmed/EmailConfirmed";
import PickPlan from "../../components/RegisterForm/PickPlan/PickPlan";
import CreateAccount from "../../components/RegisterForm/CreateAccount/CreateAccount";
import LoginToPortal from "../../components/RegisterForm/LoginToPortal/LoginToPortal";
import StripeAccount from "../../components/RegisterForm/StripeAccount/StripeAccount";

const RegisterForm = () => {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
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


  const handleChange = (field) => (e) => {
    setValues({ ...values, [field]: e.target.value });
  };

  const handleSubmit = async (values) => {
    console.log("Submitting form with values:", values);
    await handleSubmitRegister(values);
  };
  
  const handleSubmitRegister = async (values) => {
    console.log(values);
    if (values) {
       
        const response = await fetch('/api/auth/register', {
            method: "POST",
            body: JSON.stringify(values)
        });
        console.log(response);
        
        return response;
    }
    return null;
}

  const nextStep = () => {
    setStep(step + 1);
  };

  const handlePaymentSuccess = () => {
    setStep(6); // Move to the next step when payment is successful
  };

  return (
    <div>
      <div className="flex justify-center mb-12">
        <div
          className={`h-2 w-14 ${
            step === 1 ? "bg-primary" : "backgroundDisabledColor"
          } rounded-sm mr-2`}
        ></div>
        <div
          className={`h-2 w-14 ${
            step === 2 ? "bg-primary" : "backgroundDisabledColor"
          } rounded-sm mr-2`}
        ></div>
        <div
          className={`h-2 w-14 ${
            step === 3 ? "bg-primary" : "backgroundDisabledColor"
          } rounded-sm mr-2`}
        ></div>
        <div
          className={`h-2 w-14 ${
            step === 4 ? "bg-primary" : "backgroundDisabledColor"
          } rounded-sm mr-2`}
        ></div>
        <div
          className={`h-2 w-14 ${
            step === 5 ? "bg-primary" : "backgroundDisabledColor"
          } rounded-sm mr-2`}
        ></div>
        <div
          className={`h-2 w-14 ${
            step === 6 ? "bg-primary" : "backgroundDisabledColor"
          } rounded-sm`}
        ></div>
      </div>
      {step === 1 && (
        <SelectRole
          nextStep={nextStep}
          handleChange={handleChange}
          values={values}
        />
      )}
      {step === 2 && <EmailConfirmed nextStep={nextStep} />}
      {step === 3 && (
        <PickPlan
          nextStep={nextStep}
          handleChange={handleChange}
          values={values}
        />
      )}
       {step === 4 && (
        <CreateAccount
          nextStep={nextStep}
          handleChange={handleChange}
          onSubmit={handleSubmit} // Pass handleSubmit function to CreateAccount
          values={values}
        />
      )}
      {step === 5 && (
        <StripeAccount
          nextStep={nextStep}
          onPaymentSuccess={handlePaymentSuccess} // Pass the callback to update the step
        />
      )}
      {step === 6 && <LoginToPortal 
      //  handleSubmitRegister={handleSubmitRegister}
      />}
    </div>
  );
};

export default RegisterForm;
