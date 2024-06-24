"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Sidebar = () => {
  const pathname = usePathname();

  const linkClasses = (path) =>
    `flex pl-2 py-1 ${
      pathname === path ? "bg-primary rounded-lg w-10/12 items-center" : ""
    }`;

  const svgClasses = (path) =>
    `${pathname === path ? "mix-blend-difference" : "fill-current text-white"}`;

  return (
    <div className="bg-gray-900 text-white w-80 pt-8 pl-12 min-h-screen p-4">
      <div className="w-62">
        <div className="flex items-center mb-6">
          <img src="/assets/spinlab-log.png" alt="Logo" className="w-48	" />
        </div>
        <div className="flex items-center space-x-2 mb-8">
          <img
            src="https://placehold.co/40x40"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold">Faisal Ali</p>
            <p className="text-zinc-400 text-sm">FaisalAli.us@gmail.com</p>
          </div>
        </div>
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search..."
            className="w-10/12 pl-2 py-1 dark-blue-background rounded-lg text-white h-12 search-background focus:outline-none"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Link href="/dashboard" className={linkClasses("/dashboard")}>
            <img
              src="/assets/dashboard-icon.svg"
              className={svgClasses("/dashboard")}
              alt=""
            />
            <span className="flex items-center p-2">Dashboard</span>
          </Link>
          <Link href="/leaderboard" className={linkClasses("/leaderboard")}>
            <img
              src="/assets/dashboard-icon.svg"
              className={svgClasses("/leaderboard")}
              alt=""
            />
            <span className="flex items-center p-2">Leaderboard</span>
          </Link>
          <Link href="/drill-library" className={linkClasses("/drill-library")}>
            <img
              src="/assets/drill-library-icon.svg"
              className={svgClasses("/drill-library")}
              alt=""
            />
            <span className="flex items-center p-2">Drill Library</span>
          </Link>
          <Link href="/metrics" className={linkClasses("/metrics")}>
            <img
              src="/assets/metrics-icon.svg"
              className={svgClasses("/metrics")}
              alt=""
            />
            <span className="flex items-center p-2">My Metrics</span>
          </Link>
          <Link href="/history" className={linkClasses("/history")}>
            <img
              src="/assets/history-icon.svg"
              className={svgClasses("/history")}
              alt=""
            />
            <span className="flex items-center p-2">History</span>
          </Link>
          <Link href="/coaching-call" className={linkClasses("/coaching-call")}>
            <img
              src="/assets/phone-call-icon.svg"
              className={svgClasses("/coaching-call")}
              alt=""
            />
            <span className="flex items-center p-2">Coaching Call</span>
          </Link>
          <Link href="/purchases" className={linkClasses("/purchases")}>
            <img
              src="/assets/purchase-icon.svg"
              className={svgClasses("/purchases")}
              alt=""
            />
            <span className="flex items-center p-2">Purchases</span>
          </Link>
          <Link href="/subscriptions" className={linkClasses("/subscriptions")}>
            <img
              src="/assets/subscription-icon.svg"
              className={svgClasses("/subscriptions")}
              alt=""
            />
            <span className="flex items-center p-2">Subscriptions</span>
          </Link>
          <Link href="/settings" className={linkClasses("/settings")}>
            <img
              src="/assets/setting-icon.svg"
              className={svgClasses("/settings")}
              alt=""
            />
            <span className="flex items-center p-2">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
