"use client";
import { useState, useRef } from "react";
import {
    Elements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import styles from "./PaymentForm.module.css";
import axios from 'axios'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const postalCodeRegex = /^[A-Za-z0-9\s\-]{3,10}$/;

const billingSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    address: Yup.string().required("Address is required"),
    postalCode: Yup.string()
        .matches(postalCodeRegex, "Invalid postal code format")
        .required("Postal Code is required"),
});

const PaymentFormWrappper = ({ onPaymentSuccess, type, packageId, credits }) => {
    const formikRef = useRef()

    return (
        <Elements stripe={stripePromise}>
            <div className="flex flex-row gap-8">
                <div>
                    <PaymentForm {...{ onPaymentSuccess, formikRef, type, packageId, credits }} />
                </div>
                <div className="w-2/5">
                    <CheckoutForm formikRef={formikRef} />
                </div>
            </div>
        </Elements>
    )
}

const PaymentForm = ({ onPaymentSuccess, formikRef, type, packageId, credits }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentError, setPaymentError] = useState(null);

    const handleSubmit = async (values, { setSubmitting }) => {
        console.log('handleSubmit clicked')
        setSubmitting(true)
        // setIsSubmitting(true)
        setPaymentError(null);
        if (!stripe || !elements) {
            return console.error('stripe or elements not found')
        }

        const cardNumberElement = elements.getElement(CardNumberElement);
        stripe.payme
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
            // setIsSubmitting(false)
            return;
        }

        try {
            let res;
            if (type === 'subscription') {
                if (!packageId) throw new Error('No package selected')
                res = await axios.post("/api/stripe/subscription", {
                    paymentMethodId: paymentMethod.id,
                    packageId: packageId
                }).then(res => res.data)
            } else if (type === 'purchase') {
                if (!credits) throw new Error('No credits selected')
                res = await axios.post("/api/stripe/payment", {
                    paymentMethodId: paymentMethod.id,
                    credits: credits
                }).then(res => res.data)
            } else {
                throw new Error('Invalid payment type')
            }

            if (res.requiresAction) {
                const { error: actionError } = await stripe.confirmCardPayment(res.paymentIntentClientSecret);

                if (actionError) {
                    throw new Error(`Card verification failed. ${actionError?.message}`);
                    // Handle error
                } else {
                    // Inform the server to confirm the payment intent
                    //   await fetch('/api/confirm-payment-intent', {
                    //     method: 'POST',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify({ paymentIntentId: result.paymentIntentId }),
                    //   });
                    onPaymentSuccess();
                }
            } else if (res.success) {
                onPaymentSuccess();
            } else {
                throw new Error('Invalid payment type')
            }
        } catch (error) {
            console.error("Error occured:", error);
            setPaymentError(`Transaction failed: ${error.response?.data?.message || error.message}`);
        } finally {
            setSubmitting(false);
            // setIsSubmitting(false)
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
        <div className="px-8 py-6 bg-transparent border primary-border rounded-lg">
            <div className="text-center mb-4">
                <h2 className="text-white font-bold mb-4 text-2xl">
                    Billing Details
                </h2>
                <p className="text-white">
                    Data is protected under the PCI DSS standard. We do not store
                    your data and do not share it with the merchant.
                </p>
            </div>
            <div>
                <Formik
                    innerRef={formikRef}
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
                        <Form className="flex justify-between gap-8 max-w-7xl">
                            <div className="w-full">
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
                                        <CardNumberElement
                                            options={customStyles}
                                            className={`w-full py-4 px-3 bg-transparent primary-border rounded rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45 ${styles.backgroundImage} ${styles.backgroundImageCardNum}`}
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <div className="mb-2 opacity-45">
                                            <label htmlFor="">CVV</label>
                                        </div>
                                        <CardCvcElement
                                            options={customStyles}
                                            className={`w-full py-4 px-3 bg-transparent primary-border rounded rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45 ${styles.backgroundImage} ${styles.backgroundImageCvv}`}
                                        />
                                    </div>
                                </div>
                                <div className="flex mb-4 gap-6">
                                    <div className="w-1/2">
                                        <div className="mb-2 opacity-45">
                                            <label htmlFor="">Expiry Date</label>
                                        </div>
                                        <CardExpiryElement
                                            options={customStyles}
                                            className={`w-full py-4 px-3 bg-transparent primary-border rounded rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45 ${styles.backgroundImage} ${styles.backgroundImageExpiry}`}
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <div className="mb-2 opacity-45">
                                            <label htmlFor="">Postal Code</label>
                                        </div>
                                        <Field
                                            name="postalCode"
                                            placeholder="Postal Code"
                                            className="w-full py-3.5 px-3 bg-transparent primary-border rounded text-white rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45"
                                        />
                                        {errors.postalCode && touched.postalCode && (
                                            <div className="text-red-500 text-sm">
                                                {errors.postalCode}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {paymentError && (
                                    <div className="text-red-500 text-lg mb-4">{paymentError}</div>
                                )}
                                <div>
                                    <Image
                                        src="/assets/payment-cards.png"
                                        alt="Logo"
                                        width={250}
                                        height={64}
                                    />
                                </div>
                                {`${isSubmitting}`}
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};


const CheckoutForm = ({ formikRef }) => {
    return (
        <div className="pl-8 rounded-lg p-6 blueBackground flex justify-center items-center">
            <div className=" text-white rounded-lg">
                <h2 className="font-bold mb-4">SUMMARY</h2>
                <div className="border-b-2 border-dashed mb-4"></div>
                <div className="mb-4">
                    <div className="">
                        <h3 className="capitalize">TODO</h3>
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
                    onClick={() => formikRef.current?.handleSubmit()}
                    disabled={formikRef.current?.isSubmitting}
                    className="w-full bg-green-500 bg-primary rounded-lg text-black font-normal py-3 hover-shadow focus:outline-none"
                >
                    {/* {isSubmitting ? "Processing..." : "START YOUR FREE TRIAL"} */}
                    PAY
                </button>
            </div>
        </div>
    );
};

export default PaymentFormWrappper;
