import React, { useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@mui/material";
import PaymentForm from "@/components/Common/PaymentForm/PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const BillingSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  address: Yup.string().required("Address is required"),
  creditCardNumber: Yup.string().required("Credit Card Number is required"),
  cvv: Yup.string().required("CVV is required"),
  expiryDate: Yup.string().required("Expiry Date is required"),
  postalCode: Yup.string().required("Postal Code is required"),
});

const BillingTab = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formikRef = useRef()

  return (
    <>
      {!paymentSuccess ? (
        <div className="p-8 border primary-border mt-8 rounded-lg">
          <div className="flex items-center gap-14">
            <div className="mb-4 basis-1/3 pl-16">
              <div>
                <h2 className="text-white font-bold mb-4 text-2xl">
                  Billing Details
                </h2>
                <p className="text-white">
                  Data is protected under the PCI DSS standard. We do not store
                  your data and do not share it with the merchant.
                </p>
              </div>
            </div>
            <div className="flex flex-col basis-2/3">
              <div>
                <Elements stripe={stripePromise}>
                  <PaymentForm onPaymentSuccess={() => setPaymentSuccess(true)} formikRef={formikRef} setIsSubmitting={setIsSubmitting} />
                </Elements>
              </div>
              <div className="w-full justify-end flex -mt-8">
                <button
                  onClick={() => formikRef.current.handleSubmit()}
                  disabled={isSubmitting}
                  className="bg-primary dark-blue-color px-4 py-1 rounded font-bold uppercase text-sm hover-button-shadow"
                >
                  Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <div className="flex gap-6 flex-col md:flex-row">
            <div className="border primary-border py-8 pl-12 pr-16 flex justify-center flex-col rounded-lg w-fit 2xl:pr-[100px]">
              <div>
                <h2 className="text-xl font-bold">Billing Details</h2>
                <p className="mt-2">Your Name billing date is Apr 24, 2024.</p>
                <p className="text-primary mt-2">xxxx-xxxx-xxxx-4908</p>
                <div>
                  <button className="font-bold mt-2">EDIT DETAILS</button>
                </div>
                <div>
                  <button className="font-bold mt-2">
                    DOWNLOAD BILLING HISTORY
                  </button>
                </div>
              </div>
            </div>
            <div className="border primary-border py-8 flex pl-12 pr-16 justify-center flex-col rounded-lg w-fit 2xl:pr-[200px]">
              <div>
                <h2 className="text-xl font-bold mt-2">Plan Details</h2>
                <p className="mt-2">SpinLabAi Annual Subscription</p>
                <p className="text-primary mt-2 font-bold">Annual $400/yr</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pl-2">
            <p>Want to cancel your subscription?</p>
            <p>
              We're sad to see you go. Please read our
              <a href="#" className="text-primary ml-1 font-bold">
                Refund and Cancelation Policy
              </a>
            </p>
            <p>
              before contacting our support team at
              <a
                href="mailto:team@spinlabai.com"
                className="text-primary underline ml-1 font-bold"
              >
                team@spinlabai.com
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default BillingTab;
