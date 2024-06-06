'use client';
import React, { useState } from "react";
import styles from "../../app/login/login.module.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState(""); // State to store the email input
  const [message, setMessage] = useState(""); // State to store the response message

  const handleResetPassword = async () => {
    try {
      // Send a POST request to the forget password endpoint with the email
      const response = await fetch("/api/auth/forgetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      setMessage(data.message); // Set response message
    } catch (error) {
      console.error("Error sending forget password email:", error);
      setMessage("An error occurred while sending the email.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className={styles.title}>Forget Password</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleResetPassword} className={styles.button}>
        Reset Password
      </button>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default ForgetPassword;
