'use client';
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    console.log(userSession);
    if (userSession) {
        setUserEmail(userSession.email);
    } else if(!userSession) {
        router.push("/login");
    
    }
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false }); 
    localStorage.removeItem("userSession");
    localStorage.removeItem("sessionExpiry");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>SpinLab Home</h1>
      <p>Welcome, {userEmail}</p>
      <Link href="/">
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded mt-4">Logout</button>
      </Link>
    </div>
  );
};

export default Dashboard;
