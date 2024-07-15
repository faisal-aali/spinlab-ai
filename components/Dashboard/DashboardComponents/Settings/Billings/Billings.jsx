import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@mui/material";

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
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <>
      {!formSubmitted ? (
        <div className="p-8 border primary-border mt-8 rounded-lg">
          <div className="flex items-center gap-14">
            <div className="mb-4 basis-1/3">
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
            <div className="basis-2/3">
              <Formik
                initialValues={{
                  firstName: "",
                  lastName: "",
                  address: "",
                  creditCardNumber: "",
                  cvv: "",
                  expiryDate: "",
                  postalCode: "",
                }}
                validationSchema={BillingSchema}
                onSubmit={(values) => {
                  console.log(values);
                  setFormSubmitted(true);
                }}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div className="flex justify-between mb-4 gap-6">
                      <div className="w-1/2">
                        <div className="mb-2 opacity-45">
                          <label htmlFor="firstName">First Name</label>
                        </div>
                        <Field
                          name="firstName"
                          placeholder="First Name"
                          className={`w-full py-3 px-3 dark-blue-background rounded-lg text-primary focus:outline-none placeholder:opacity-45 ${errors.firstName && touched.firstName
                              ? "border-red-900 border"
                              : "primary-border focus:border-green-500"
                            }`}
                        />
                      </div>
                      <div className="w-1/2">
                        <div className="mb-2 opacity-45">
                          <label htmlFor="lastName">Last Name</label>
                        </div>
                        <Field
                          name="lastName"
                          placeholder="Last Name"
                          className={`w-full py-3 px-3 dark-blue-background rounded-lg text-primary focus:outline-none placeholder:opacity-45 ${errors.lastName && touched.lastName
                              ? "border-red-900 border"
                              : "primary-border focus:border-green-500"
                            }`}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="mb-2 opacity-45">
                        <label htmlFor="address">Address</label>
                      </div>
                      <Field
                        name="address"
                        placeholder="Address"
                        className={`w-full py-3 px-3 dark-blue-background rounded-lg text-primary focus:outline-none placeholder:opacity-45 ${errors.address && touched.address
                            ? "border-red-900 border"
                            : "primary-border focus:border-green-500"
                          }`}
                      />
                    </div>
                    <div className="flex justify-between mb-4 gap-6">
                      <div className="w-1/2">
                        <div className="mb-2 opacity-45">
                          <label htmlFor="creditCardNumber">
                            Credit Card Number
                          </label>
                        </div>
                        <Field
                          name="creditCardNumber"
                          placeholder="Credit Card Number"
                          className={`w-full py-3 px-3 dark-blue-background rounded-lg text-primary focus:outline-none placeholder:opacity-45 ${errors.creditCardNumber && touched.creditCardNumber
                              ? "border-red-900 border"
                              : "primary-border focus:border-green-500"
                            }`}
                        />
                      </div>
                      <div className="w-1/2">
                        <div className="mb-2 opacity-45">
                          <label htmlFor="cvv">CVV</label>
                        </div>
                        <Field
                          name="cvv"
                          placeholder="CVV"
                          className={`w-full py-3 px-3 dark-blue-background rounded-lg text-primary focus:outline-none placeholder:opacity-45 ${errors.cvv && touched.cvv
                              ? "border-red-900 border"
                              : "primary-border focus:border-green-500"
                            }`}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between mb-4 gap-6">
                      <div className="w-1/2">
                        <div className="mb-2 opacity-45">
                          <label htmlFor="expiryDate">Expiry Date</label>
                        </div>
                        <Field
                          name="expiryDate"
                          placeholder="Expiry Date"
                          className={`w-full py-3 px-3 dark-blue-background rounded-lg text-primary focus:outline-none placeholder:opacity-45 ${errors.expiryDate && touched.expiryDate
                              ? "border-red-900 border"
                              : "primary-border focus:border-green-500"
                            }`}
                        />
                      </div>
                      <div className="w-1/2">
                        <div className="mb-2 opacity-45">
                          <label htmlFor="postalCode">Postal Code</label>
                        </div>
                        <Field
                          name="postalCode"
                          placeholder="Postal Code"
                          className={`w-full py-3 px-3 dark-blue-background rounded-lg text-primary focus:outline-none placeholder:opacity-45 ${errors.postalCode && touched.postalCode
                              ? "border-red-900 border"
                              : "primary-border focus:border-green-500"
                            }`}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between mb-8">
                      <div className="flex items-center">
                        <img
                          src="/assets/payment-cards.png"
                          alt="Visa"
                          className="mr-2"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-primary dark-blue-color px-4 py-1 rounded font-bold uppercase text-sm"
                      >
                        Pay
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border primary-border py-8 pl-12 pr-8 flex justify-center flex-col rounded-lg">
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
            <div className="border primary-border py-8 flex pl-12 pr-8 justify-center flex-col rounded-lg">
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
