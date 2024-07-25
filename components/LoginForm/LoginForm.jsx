"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import styles from "./LoginForm.module.css";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useMediaQuery from '@mui/material/useMediaQuery';
import Image from 'next/image';


const LoginForm = () => {
  // const userSession = useSession().data?.user
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const matches = useMediaQuery('(max-width:768px)');

  useEffect(() => {
    console.log('matches', matches)
  }, [matches]);

  useEffect(() => {
    getSession().then(data => {
      if (data?.user) router.push('/dashboard')
    }).catch(console.error)
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      email: user.email,
      password: user.password,
      redirect: false,
      // callbackUrl: '/dashboard'
    })

    if (!result.error) {
      let userSession = await getSession().then(data => data?.user).catch(console.error)
      if (userSession)
        localStorage.setItem('userRole', userSession.role)
      // router.push(searchParams.get('callbackUrl') || '/dashboard')
      router.push('/dashboard')
    } else {
      setError(result.status === 401 ? "Invalid email or password" : result.error);
    }
  };

  return (
    <div
      className={`flex flex-col md:flex-row min-h-screen items-center bg-zinc-900 relative ${!matches ? '' : styles.loginBackground}`}
    >
      <div className="backgroundOverlay"></div>
      <div className={`flex items-center py-16 justify-center w-full lg:w-2/5 ${!matches ? styles.loginBackground : ''} h-fit md:h-screen`}>
        <div className="z-10">
          <Image
            src="/assets/spinlab-log.png"
            alt="Logo"
            width={!matches ? 370 : 250}
            height={103}
          />
        </div>
      </div>
      <div className="flex items-center justify-center w-full p-8 lg:w-3/5 z-20  h-fit md:h-screen">
        <div className="bg-transparent border primary-border py-12 px-6 rounded-lg w-full max-w-[400px]">
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
                className="w-full px-3 bg-transparent bg-opacity-20 rounded-lg py-3 text-white primary-border rounded focus:outline-none focus:border-green-500 placeholder:opacity-45"
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
