"use client";
import { useEffect, useState } from "react";
import SelectRole from "../../components/RegisterForm/SelectRole/SelectRole";
import CreateAccount from "../../components/RegisterForm/CreateAccount/CreateAccount";
import OpenDashboard from "../../components/RegisterForm/OpenDashboard/OpenDashboard";
import { useRouter, useSearchParams } from "next/navigation";
import PickYourMembership from "../Common/PickYourMembership/PickYourMembership";
import PaymentForm from "../Common/PaymentForm/PaymentForm";
import { useSession } from "next-auth/react";

const RegisterForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userSession = useSession().data?.user || {};

  useEffect(() => {
    if (userSession.role) router.replace("/dashboard");
  }, [userSession]);

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
    if (step === 4 && values.package.plan === "free") {
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
            } rounded-sm mr-2`}
        ></div>
        {/* <div
          className={`h-2 w-14 ${step === 6 ? "bg-primary" : "backgroundDisabledColor"
            } rounded-sm mr-2`}
        ></div> */}
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
        {/* {step === 2 && (
          <div className="bg-transparent border primary-border rounded-lg max-w-7xl">
            <PickPlan
              nextStep={nextStep}
              handleChange={handleChange}
              values={values}
            />
          </div>
        )} */}
        {step === 2 && (
          <div className="bg-transparent max-w-[90rem] p-6 border primary-border rounded-lg">
            <PickYourMembership
              plan={values.plan}
              role={values.role}
              onSubmit={(_package, plan) => {
                handleChange("package")({ target: { value: _package } })
                nextStep()
              }}
            />
          </div>
        )}
        {step === 3 && (
          <CreateAccount
            nextStep={nextStep}
            values={values}
          />
        )}
        {step === 4 && values.package.plan !== "free" && (
          <PaymentForm onPaymentSuccess={() => setStep(5)} _package={values.package} type='subscription' />
        )}
        {step === 5 && <OpenDashboard />}
      </div>
    </div>
  );
};

export default RegisterForm;
