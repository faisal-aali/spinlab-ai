"use client";
import React, { useState } from "react";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Image from "next/image";

const billingSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  address: Yup.string().required("Address is required"),
  postalCode: Yup.string().required("Postal Code is required"),
});

const CheckoutForm = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  //   const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setPaymentError(null);
    if (!stripe || !elements) {
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
      billing_details: {
        name: `${values.firstName} ${values.lastName}`,
        address: {
          line1: values.address,
          postal_code: values.postalCode,
        },
      },
    });

    if (error) {
      setPaymentError(error.message);
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create subscription");
      }

      onPaymentSuccess();
    } catch (error) {
      console.error("Error creating subscription:", error);
      setPaymentError("Failed to create subscription");
    } finally {
      setSubmitting(false);
    }
  };


  const customStyles = {
    style: {
      base: {
        color: "#ffffff", 
        fontSize: "16px",
        "::placeholder": {
          color: "#ffffff45",
        },
      },
      invalid: {
        color: "#fa755a", 
      },
    },
  };

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        address: "",
        postalCode: "",
      }}
      validationSchema={billingSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="flex justify-between gap-8 max-w-7xl	">
          <div className="w-7/12 px-8 py-6 bg-transparent border primary-border rounded-lg">
            <div className="text-center mb-4">
              <h2 className="text-white font-bold mb-4 text-2xl">
                Billing Details
              </h2>
              <p>
                Data is protected under the PCI DSS standard. We do not store
                your data and do not share it with the merchant.
              </p>
            </div>
            <div className="flex items-center mb-4 gap-6">
              <div className="w-1/2">
                <div className="mb-2 opacity-45">
                  <label htmlFor="">First Name</label>
                </div>
                <Field
                  name="firstName"
                  placeholder="First Name"
                  className="w-full py-3 px-3 bg-transparent primary-border rounded text-white rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45"
                />
                {errors.firstName && touched.firstName && (
                  <div className="text-red-500 text-sm">{errors.firstName}</div>
                )}
              </div>
              <div className="w-1/2">
                <div className="mb-2 opacity-45">
                  <label htmlFor="">Last Name</label>
                </div>
                <Field
                  name="lastName"
                  placeholder="Last Name"
                  className="w-full py-3 px-3 bg-transparent primary-border rounded text-white rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45"
                />
                {errors.lastName && touched.lastName && (
                  <div className="text-red-500 text-sm">{errors.lastName}</div>
                )}
              </div>
            </div>
            <div className="mb-4 ">
              <div className="mb-2 opacity-45">
                <label htmlFor="">Address</label>
              </div>
              <Field
                name="address"
                placeholder="Address"
                className="w-full py-3 px-3 bg-transparent primary-border rounded text-white rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45"
              />
              {errors.address && touched.address && (
                <div className="text-red-500 text-sm">{errors.address}</div>
              )}
            </div>
            <div className="flex mb-4 gap-6">
              <div className="w-1/2">
                <div className="mb-2 opacity-45">
                  <label htmlFor="">Credit Card Number</label>
                </div>
                <CardNumberElement options={customStyles} className="w-full py-4 px-3 bg-transparent primary-border rounded rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45" />
              </div>
              <div className="w-1/2">
                <div className="mb-2 opacity-45">
                  <label htmlFor="">CVV</label>
                </div>
                <CardCvcElement options={customStyles} className="w-full py-4 px-3 bg-transparent primary-border rounded text-white rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45" />
              </div>
            </div>
            <div className="flex mb-4 gap-6">
              <div className="w-1/2">
                <div className="mb-2 opacity-45">
                  <label htmlFor="">Expiry Date</label>
                </div>
                <CardExpiryElement options={customStyles} className="w-full py-4 px-3 bg-transparent primary-border rounded text-white rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45" />
              </div>
              <div className="w-1/2">
                <div className="mb-2 opacity-45">
                  <label htmlFor="">Postal Code</label>
                </div>
                <Field
                  name="postalCode"
                  placeholder="Postal Code"
                  className="w-full py-3 px-3 bg-transparent primary-border rounded text-white rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45"
                />
                {errors.postalCode && touched.postalCode && (
                  <div className="text-red-500 text-sm">
                    {errors.postalCode}
                  </div>
                )}
              </div>
            </div>
            {paymentError && (
              <div className="text-red-500 text-sm">{paymentError}</div>
            )}
            <div>
              <Image
                src="/assets/payment-cards.png"
                alt="Logo"
                width={250}
                height={64}
              />
            </div>
          </div>
          <div className="w-5/12 pl-8  rounded-lg p-6 blueBackground flex justify-center items-center">
            <div className=" text-white rounded-lg">
              <h2 className="font-bold mb-4">SUMMARY</h2>
              <div className="border-b-2 border-dashed mb-4"></div>
              <div className="mb-4">
                <div className="">
                  <h3>Annual</h3>
                  <h2 className="text-primary">$460.00</h2>
                </div>
              </div>
              <div className="my-12">
              <div className="mb-4">
                <div className="flex justify-between">
                  <h3 className="text-xl">SubTotal</h3>
                  <h3 className="text-xl">$460.00</h3>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between">
                  <h3 className="text-xl">Total</h3>
                  <h3 className="text-xl">$460.00</h3>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between">
                  <h3 className="text-xl">Due Today</h3>
                  <h3 className="text-xl">$0.00</h3>
                </div>
              </div>
              </div>
              <p className="text-zinc-400 mb-4">
                Your free trial begins on May 21, 2024 and will end on May 28,
                2024. You'll be charged $460.00 a year on an annual plan
                starting on May 28, 2024.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-500 bg-primary rounded-lg text-black font-normal py-3 hover-shadow focus:outline-none"
              >
                {isSubmitting ? "Processing..." : "START YOUR FREE TRIAL"}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CheckoutForm;
