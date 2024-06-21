// components/Layout.js
"use client";
import Sidebar from "../Sidebar/Sidebar";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FiLogOut } from 'react-icons/fi';

const Layout = ({ children }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem("userSession");
    localStorage.removeItem("sessionExpiry");
    router.push("/login");
    Cookies.remove("loggedin");
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 dashboard-background">
        <div className="flex justify-between items-center mb-8 absolute right-10">
          <div className="flex space-x-4">
            <button className="bg-white text-zinc-900 px-4 py-2 rounded-lg">
              UPLOAD
            </button>
            <button className="bg-white text-zinc-900 px-4 py-2 rounded-lg">
              PURCHASE
            </button>
            <div className="">
            <FiLogOut onClick={handleLogout} className="mr-2 text-primary text-3xl cursor-pointer" />
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
