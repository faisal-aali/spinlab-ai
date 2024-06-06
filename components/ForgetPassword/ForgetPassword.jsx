'use client';
import React, { useState } from "react";
import styles from "../../app/login/login.module.css"

const ForgetPassword = () => {
  const [email, setEmail] = useState(""); // State to store the email input

  const handleResetPassword = async () => {
    try {
      // Send a POST request to the forget password endpoint with the email
      const response = await fetch("/api/forgetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      console.log(data); // Log response data
      // Optionally, you can show a message to the user indicating that an email has been sent
    } catch (error) {
      console.error("Error sending forget password email:", error);
      // Optionally, you can show an error message to the user
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
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
    </div>
  );
};

export default ForgetPassword;
