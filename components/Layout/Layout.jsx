// components/Layout.js
"use client";
import Sidebar from "../Sidebar/Sidebar";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FiLogOut } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";

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
      <div className="flex-1 py-4 px-8 dashboard-background">
        <div className="flex justify-between items-center mb-8 absolute right-10 top-12	">
          <div className="flex space-x-4 items-center">
            <button className="bg-white text-black px-5 py-1 rounded-lg">
              UPLOAD
            </button>
            <button className="bg-white text-black px-5 py-1 rounded-lg">
              PURCHASE
            </button>
            <div className="flex">
              <IoNotificationsOutline className="mr-4 text-primary text-3xl cursor-pointer" />
              <FiLogOut
                onClick={handleLogout}
                className=" text-primary text-3xl cursor-pointer"
              />
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
