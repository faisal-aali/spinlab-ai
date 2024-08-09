import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button, CircularProgress } from "@mui/material";
import UpdateCardDetails from "@/components/Common/UpdateCardDetails/UpdateCardDetails";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios, { AxiosError } from 'axios'
import { useApp } from "@/components/Context/AppContext";

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
  const { user } = useApp()
  const [profileError, setProfileError] = useState(false)
  const [customer, setCustomer] = useState()
  const [paymentMethods, setPaymentMethods] = useState()
  const [updateDetails, setUpdateDetails] = useState(false)
  const [updateDetailsSucess, setUpdateDetailsSucess] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formikRef = useRef()

  const defaultPaymentMethod = (customer && paymentMethods && paymentMethods.find(pm => pm.id === customer.invoice_settings.default_payment_method))

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    axios.get('/api/stripe/customer').then(res => {
      setCustomer(res.data)
      axios.get('/api/stripe/customer/paymentMethods').then(res => {
        setPaymentMethods(res.data)
      }).catch(err => {
        setProfileError(true)
        console.error(err)
      })
    }).catch(err => {
      setProfileError(true)
      console.error(err)
    })
  }

  const handleDownloadPaymentHistory = () => {
    setDownloading(true)
    axios.get('/api/stripe/customer/paymentHistory', {
      responseType: 'blob'
    }).then(async res => {
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'payment_history.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setDownloading(false)
    })
  }

  return (
    !customer || !paymentMethods ? <CircularProgress size={20} /> :
      <>
        {/* {!paymentSuccess ? (
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
      ) : ( */}
        {updateDetails ? <UpdateCardDetails onUpdateSuccess={() => {
          setUpdateDetails(false)
          setUpdateDetailsSucess(true)
        }} /> :
          updateDetailsSucess ?

            <div className="text-center p-8 rounded-lg mx-auto">
              <div className="flex flex-col justify-center items-center h-full">
                <img
                  src={'/assets/checkmark.png'}
                  alt="Activated"
                  className="w-24 h-24 mb-4"
                />
                <h2 className="text-white text-3xl mt-2 mb-4 font-semibold capitalize">
                  Your billing details have been updated!
                </h2>
                <button
                  variant="contained"
                  className="bg-white text-black font-bold px-12 py-1 rounded mt-4"
                  onClick={() => {
                    setPaymentMethods(false)
                    setCustomer(false)
                    setUpdateDetailsSucess(false)
                    fetchData()
                  }}
                >
                  OK
                </button>
              </div>
            </div> :
            <div>
              <div className="flex gap-6 flex-col md:flex-row">
                <div className="border primary-border py-8 pl-12 pr-16 flex justify-center flex-col rounded-lg w-fit 2xl:pr-[100px]">
                  <div>
                    <h2 className="text-xl font-bold">Billing Details</h2>
                    {profileError ?
                      <p>No billing profile found.</p> :
                      <div>
                        <p className="text-primary mt-1">{defaultPaymentMethod.billing_details.name}</p>
                        <p className="text-primary mt-1">xxxx-xxxx-xxxx-{defaultPaymentMethod.card.last4}</p>
                        <p className="text-primary mt-1">Expires on {defaultPaymentMethod.card.exp_month}/{defaultPaymentMethod.card.exp_year}</p>
                        <div>
                          <button onClick={() => setUpdateDetails(true)} className="font-bold mt-2">EDIT DETAILS</button>
                        </div>
                        <div>
                          <button className="font-bold mt-2" onClick={handleDownloadPaymentHistory}>
                            {downloading ? <CircularProgress size={20} /> : 'DOWNLOAD BILLING HISTORY'}
                          </button>
                        </div>
                      </div>
                    }
                  </div>
                </div>
                <div className="border primary-border py-8 flex pl-12 pr-16 justify-center flex-col rounded-lg w-fit 2xl:pr-[200px]">
                  <div>
                    <h2 className="text-xl font-bold mt-2">Plan Details</h2>
                    <p className="mt-2">{user.subscription.package?.name || 'Free'}</p>
                    {user.subscription.package?.amount &&
                      <p className="text-primary mt-2 font-bold">${(user.subscription.package?.amount / 100).toFixed(2)} {user.subscription.package?.plan}</p>}
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
            </div>}
      </>
  );
};

export default BillingTab;
