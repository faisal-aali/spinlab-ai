"use client";
import SelectRole from "../../components/RegisterForm/SelectRole/SelectRole";
import EmailConfirmed from "../../components/RegisterForm/EmailConfirmed/EmailConfirmed";
import PickPlan from "../../components/RegisterForm/PickPlan/PickPlan";
import CreateAccount from "../../components/RegisterForm/CreateAccount/CreateAccount";
import LoginToPortal from "../../components/RegisterForm/LoginToPortal/LoginToPortal";
import StripeAccount from "../../components/RegisterForm/StripeAccount/StripeAccount";
import { useState } from "react";

const registerForm = () => {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email:"",
    role:"",
    city: "",
    country: "",
    password: "",
    confirmPassword: "",
    plan: "",
  });

  const handleChange = (field) => (e) => {
    setValues({ ...values, [field]: e.target.value });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  console.log(values);
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
          values={values}
        />
      )}
      {step === 5 && (
        <StripeAccount
          nextStep={nextStep}
        />
      )}

        {step === 6 && (
        <LoginToPortal
        />
      )}
    </div>
  );
};

export default registerForm;
