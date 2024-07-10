import React from "react";
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
  return (
    <div className="p-8 border primary-border mt-8 rounded-lg">
      <div className="flex items-center gap-14	">
        <div className="mb-4 basis-1/3	">
          <div>
            <h2 className="text-white font-bold mb-4 text-2xl">
              Billing Details
            </h2>
            <p className="text-white">
              Data is protected under the PCI DSS standard. We do not store your
              data and do not share it with the merchant.
            </p>
          </div>
        </div>
        <div className="basis-2/3	">
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
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="flex justify-between mb-4 gap-6">
                  <div className="w-1/2">
                    <div className="mb-2 opacity-45">
                      <label htmlFor="">First Name</label>
                    </div>
                    <Field
                      name="firstName"
                      placeholder="First Name"
                      className={`w-full py-3 px-3 dark-blue-background rounded-lg text-white focus:outline-none placeholder:opacity-45 ${
                        errors.firstName && touched.firstName
                          ? "border-red-900 border"
                          : "primary-border focus:border-green-500"
                      }`}
                    />
                  </div>
                  <div className="w-1/2">
                    <div className="mb-2 opacity-45">
                      <label htmlFor="">Last Name</label>
                    </div>
                    <Field
                      name="lastName"
                      placeholder="Last Name"
                      className={`w-full py-3 px-3 dark-blue-background rounded-lg text-white focus:outline-none placeholder:opacity-45 ${
                        errors.lastName && touched.lastName
                          ? "border-red-900 border"
                          : "primary-border focus:border-green-500"
                      }`}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="mb-2 opacity-45">
                    <label htmlFor="">Address</label>
                  </div>
                  <Field
                    name="address"
                    placeholder="Address"
                    className={`w-full py-3 px-3 dark-blue-background rounded-lg text-white focus:outline-none placeholder:opacity-45 ${
                      errors.address && touched.address
                        ? "border-red-900 border"
                        : "primary-border focus:border-green-500"
                    }`}
                  />
                </div>
                <div className="flex justify-between mb-4 gap-6">
                  <div className="w-1/2">
                    <div className="mb-2 opacity-45">
                      <label htmlFor="">Credit Card Number</label>
                    </div>
                    <Field
                      name="creditCardNumber"
                      placeholder="Credit Card Number"
                      className={`w-full py-3 px-3 dark-blue-background rounded-lg text-white focus:outline-none placeholder:opacity-45 ${
                        errors.creditCardNumber && touched.creditCardNumber
                          ? "border-red-900 border"
                          : "primary-border focus:border-green-500"
                      }`}
                    />
                  </div>
                  <div className="w-1/2">
                    <div className="mb-2 opacity-45">
                      <label htmlFor="">CVV</label>
                    </div>
                    <Field
                      name="cvv"
                      placeholder="CVV"
                      className={`w-full py-3 px-3 dark-blue-background rounded-lg text-white focus:outline-none placeholder:opacity-45 ${
                        errors.cvv && touched.cvv
                          ? "border-red-900 border"
                          : "primary-border focus:border-green-500"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex justify-between mb-4 gap-6">
                  <div className="w-1/2">
                    <div className="mb-2 opacity-45">
                      <label htmlFor="">Expiry Date</label>
                    </div>
                    <Field
                      name="expiryDate"
                      placeholder="Expiry Date"
                      className={`w-full py-3 px-3 dark-blue-background rounded-lg text-white focus:outline-none placeholder:opacity-45 ${
                        errors.expiryDate && touched.expiryDate
                          ? "border-red-900 border"
                          : "primary-border focus:border-green-500"
                      }`}
                    />
                  </div>
                  <div className="w-1/2">
                    <div className="mb-2 opacity-45">
                      <label htmlFor="">Postal Code</label>
                    </div>
                    <Field
                      name="postalCode"
                      placeholder="Postal Code"
                      className={`w-full py-3 px-3 dark-blue-background rounded-lg text-white focus:outline-none placeholder:opacity-45 ${
                        errors.postalCode && touched.postalCode
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
  );
};

export default BillingTab;
