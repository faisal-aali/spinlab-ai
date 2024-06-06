'use client';
import { useState } from "react";
import { signIn } from "next-auth/react";
import styles from "./LoginForm.module.css";
import Link from "next/link";

// Define LoginForm component
const LoginForm = () => {
  // Initialize state variables
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Call signIn function to authenticate user
    const result = await signIn("credentials", {
      email: user.email,
      password: user.password,
      redirect: false // Disable default redirect behavior
    });

    // Check if authentication is successful
    if (!result.error) {
      // Redirect to success page
      window.location.href = "/success";
    } else {
      // Handle authentication error
      setError("Invalid email or password."); // Display error message
    }
  };


  return (
    <div className={`min-h-screen flex items-center justify-center ${styles.formWidth}`}>
      <div className="w-full flex items-center justify-center">
        <div className="bg-transparent border primary-border py-12 px-6 rounded-lg w-full max-w-md">
          <h2 className="text-white text-2xl mb-6 text-center">Login</h2>
          <form className="mt-11" onSubmit={handleSubmit}>
            <div className="mb-4">
              <input className="w-full bg-transparent px-3 rounded-lg py-3 text-white primary-border rounded focus:outline-none focus:border-green-500 placeholder:opacity-45" type="email" name="email" value={user.email} onChange={e => setUser(prevUser => ({ ...prevUser, email: e.target.value }))} required placeholder="Email"/>
            </div>
            <div className="mb-6">
              <input className="w-full px-3 bg-transparent rounded-lg py-3 text-white primary-border rounded focus:outline-none focus:border-green-500 placeholder:opacity-45	" type="password" name="password" value={user.password} onChange={e => setUser(prevUser => ({ ...prevUser, password: e.target.value }))} required placeholder="Password"/>
            </div>
            <div className="text-red-500 mb-4">{error}</div>
            <div className="flex justify-between items-center mb-6">
              <Link href="/forgetpassword" className="text-green-500 text-sm text-primary">Forgot Password?</Link>
            </div>
            <button type="submit" className="w-full bg-green-500 bg-primary rounded-lg text-black font-normal py-3 rounded hover-shadow focus:outline-none">LOGIN</button>
          </form>
          <p className="text-zinc-400 text-center mt-6">Don't have an account? <Link href="/register" className="text-white font-bold">REGISTER NOW</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
