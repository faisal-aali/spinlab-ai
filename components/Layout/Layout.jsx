// components/Layout.js
"use client";
import Sidebar from "../Sidebar/Sidebar";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FiLogOut } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import HeaderProfile from '../Common/HeaderProfile/HeaderProfile'
import { useEffect } from "react";

const Layout = ({ children }) => {
  const user = useSession().data?.user || {}
  const router = useRouter();
  const pathname = usePathname()

  useEffect(() => {
    if (!user.role) router.replace('/login')
  }, [user]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem("userSession");
    localStorage.removeItem("sessionExpiry");
    router.replace("/login");
    Cookies.remove("loggedin");
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 py-4 px-8 dashboard-background">
        {((user.role === 'trainer' && ['/dashboard', '/add-player', '/players-history', '/players-metrics', '/metrics'].includes(pathname))
          || (user.role === 'player' && ['/dashboard'].includes(pathname))
          || (user.role === 'coach' && ['/dashboard', '/users', '/users/view'].includes(pathname))
          || (user.role === 'admin' && ['/dashboard', '/users', '/users/view'].includes(pathname)))
          && <div>
            <HeaderProfile />
          </div>}
        <div className="flex justify-between items-center mb-8 absolute right-10 top-12	">
          <div className="flex space-x-4 items-center">
            <button className={`bg-white text-black px-5 py-1 rounded-lg ${user.role === 'trainer' && 'hidden'}`}>
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
