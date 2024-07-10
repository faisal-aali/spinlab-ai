"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "./LoginForm.module.css";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = () => {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    if (userSession) {
      router.push("/dashboard");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    Cookies.set("loggedin", "true");

    const result = await signIn("credentials", {
      email: user.email,
      password: user.password,
      redirect: false,
    });

    if (!result.error) {
      console.log('sign in success',result)
      localStorage.setItem(
        "userSession",
        JSON.stringify({
          email: user.email
        })
      );
      const expiryTime = new Date().getTime() + 3600000;
      localStorage.setItem("sessionExpiry", expiryTime);
      router.push("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${styles.formWidth}`}
    >
      <div className="w-full flex items-center justify-center">
        <div className="bg-transparent border primary-border py-12 px-6 rounded-lg w-full max-w-md">
          <h2 className="text-white text-2xl mb-6 text-center">Login</h2>
          <form className="mt-11" onSubmit={(e) => handleSubmit(e)}>
            <div className="mb-4">
              <input
                className="w-full bg-transparent px-3 rounded-lg py-3 text-white primary-border rounded focus:outline-none focus:border-green-500 placeholder:opacity-45"
                type="email"
                name="email"
                value={user.email}
                onChange={(e) =>
                  setUser((prevUser) => ({
                    ...prevUser,
                    email: e.target.value,
                  }))
                }
                required
                placeholder="Email"
              />
            </div>
            <div className="mb-6 relative">
              <input
                className="w-full px-3 bg-transparent rounded-lg py-3 text-white primary-border rounded focus:outline-none focus:border-green-500 placeholder:opacity-45"
                type={showPassword ? "text" : "password"}
                name="password"
                value={user.password}
                onChange={(e) =>
                  setUser((prevUser) => ({
                    ...prevUser,
                    password: e.target.value,
                  }))
                }
                required
                placeholder="Password"
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="text-red-500 mb-4">{error}</div>
            <div className="flex justify-between items-center mb-6">
              <Link
                href="/forgetpassword"
                className="text-green-500 text-sm text-primary"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 bg-primary rounded-lg text-black font-normal py-3 rounded hover-shadow focus:outline-none"
            >
              LOGIN
            </button>
          </form>
          <p className="text-zinc-400 text-center mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-white font-bold">
              REGISTER NOW
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
