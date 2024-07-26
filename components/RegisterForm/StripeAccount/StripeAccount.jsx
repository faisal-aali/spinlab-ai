import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const StripePayment = ({ nextStep, values }) => {
  const handlePaymentSuccess = () => {
    nextStep();
  };

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm onPaymentSuccess={handlePaymentSuccess} values={values} />
    </Elements>
  );
};

export default StripePayment;
