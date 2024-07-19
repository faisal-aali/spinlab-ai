"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styles from "../../app/login/login.module.css";
import * as Yup from "yup";

const ForgetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ForgetPassword = () => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = async (values, { resetForm }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await ForgetPasswordSchema.validate(values, { abortEarly: false });
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });
      const data = await response.json();
      setMessage(data.message);
      resetForm();
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error sending forget password email:", error);
      setMessage("An error occurred while sending the email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-transparent border primary-border rounded-lg max-w-7xl p-8">
      <h2 className="text-white text-3xl font-bold mb-6 text-center">
        Forget Password
      </h2>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={ForgetPasswordSchema}
        onSubmit={handleResetPassword}
      >
        <Form>
          <div className="mb-4 mt-4">
            <Field
              type="email"
              name="email"
              placeholder="Enter your email"
              className={`w-full py-3 px-3 bg-transparent primary-border rounded text-white rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45 ${styles.fieldError ? "border-red-500" : ""
                }`}
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm pl-2 pt-2"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 bg-green-500 bg-primary rounded-lg w-80 text-black font-normal px-3 py-3 rounded hover-shadow focus:outline-none"
          >
            {isSubmitting ? "Processing..." : "Reset Password"}
          </button>
          {message && <p className="mt-4">{message}</p>}
        </Form>
      </Formik>
    </div>
  );
};

export default ForgetPassword;
