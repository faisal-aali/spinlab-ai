'use client';
import React, { useState } from "react";
import { useSearchParams } from 'next/navigation';
import styles from "../../app/login/login.module.css";
import Link from "next/link";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    try {
      // Send a POST request to the reset password endpoint with the new password and token
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, token, newPassword, confirmNewPassword })
      });
      const data = await response.json();
      setMessage(data.message); // Set response message
      if(response.ok)
        {
            window.location.href = '/login';
        }
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("An error occurred while resetting the password.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className={styles.title}>Reset Password</h1>
      <input
        type="password"
        placeholder="Enter your new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Confirm your new password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleResetPassword} className={styles.button}>
        Reset Password
      </button>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default ResetPassword;
