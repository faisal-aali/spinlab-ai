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
import styles from "./PaymentForm.module.css";

const postalCodeRegex = /^[A-Za-z0-9\s\-]{3,10}$/;

const billingSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    address: Yup.string().required("Address is required"),
    postalCode: Yup.string()
        .matches(postalCodeRegex, "Invalid postal code format")
        .required("Postal Code is required"),
});

const PaymentForm = ({ onPaymentSuccess, formikRef, setIsSubmitting }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentError, setPaymentError] = useState(null);

    const handleSubmit = async (values, { setSubmitting }) => {
        setIsSubmitting(true)
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
            setIsSubmitting(false)
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
            setIsSubmitting(false)
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
            {({ errors, touched }) => (
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
                </Form>
            )}
        </Formik>
    );
};

export default PaymentForm;
