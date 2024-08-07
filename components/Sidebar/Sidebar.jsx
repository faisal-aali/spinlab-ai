"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import profileStyle from './sidebar.module.css'
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useApp } from "../Context/AppContext";
import { Menu } from "@mui/icons-material";

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const userSession = useSession().data?.user || {}
  const pathname = usePathname();
  const route = useRouter()
  const searchParams = useSearchParams()
  const { user } = useApp();

  const linkClasses = (path, pathValidator) =>
    `flex pl-2 py-1 ${(pathValidator ? pathValidator(pathname, searchParams) : pathname.startsWith(path)) ? "bg-primary rounded-lg min-w-[200px] w-fit items-center text-black" : "text-white"
    }`;

  const svgClasses = (path, pathValidator) =>
    `${(pathValidator ? pathValidator(pathname, searchParams) : pathname.startsWith(path)) ? "mix-blend-difference" : "fill-current text-white"}`;

  const links = [
    {
      url: '/dashboard',
      icon: '/assets/dashboard-icon.svg',
      label: 'Dashboard',
      roles: ['player', 'trainer', 'staff']
    },
    {
      url: '/leaderboard',
      icon: '/assets/leaderboard-icon.svg',
      label: 'Leaderboard',
      roles: ['player', 'trainer', 'staff', 'admin']
    },
    {
      url: '/drill-library',
      icon: '/assets/drill-library-icon.svg',
      label: 'Drill Library',
      roles: ['player', 'trainer', 'staff', 'admin']
    },
    {
      url: '/add-player',
      icon: '/assets/add-player-icon.svg',
      label: 'Add Player',
      roles: ['trainer']
    },
    {
      url: '/metrics',
      icon: '/assets/metrics-icon.svg',
      label: 'My Metrics',
      roles: ['player']
    },
    {
      url: '/players-metrics',
      icon: '/assets/metrics-icon.svg',
      label: 'My Player Metrics',
      roles: ['trainer']
    },
    {
      url: '/history',
      icon: '/assets/history-icon.svg',
      label: 'History',
      roles: ['player']
    },
    {
      url: '/players-history',
      icon: '/assets/history-icon.svg',
      label: 'My Player History',
      roles: ['trainer']
    },
    {
      url: '/users',
      query: '?role=player',
      icon: `/assets/${userSession.role === 'staff' ? 'players-database-icon.svg' : userSession.role === 'admin' ? 'add-player-icon.svg' : ''}`,
      label: userSession.role === 'staff' ? 'Players Database' : userSession.role === 'admin' ? 'Manage Player Database' : 'Invalid role',
      roles: ['staff', 'admin'],
      pathValidator: function (pathname, searchParams) {
        const query = Object.fromEntries(searchParams.entries())
        const path = pathname + `?${Object.keys(query).map(k => `${k}=${query[k]}`).join('&')}`
        return (path.startsWith(this.url) && path.endsWith(this.query))
      }
    },
    {
      url: '/users',
      query: '?role=staff',
      icon: '/assets/add-player-icon.svg',
      label: 'Manage Staff Database',
      roles: ['admin'],
      pathValidator: function (pathname, searchParams) {
        const query = Object.fromEntries(searchParams.entries())
        const path = pathname + `?${Object.keys(query).map(k => `${k}=${query[k]}`).join('&')}`
        return (path.startsWith(this.url) && path.endsWith(this.query))
      }
    },
    {
      url: '/users',
      query: '?role=trainer',
      icon: '/assets/add-player-icon.svg',
      label: 'Manage Trainer Database',
      roles: ['admin'],
      pathValidator: function (pathname, searchParams) {
        const query = Object.fromEntries(searchParams.entries())
        const path = pathname + `?${Object.keys(query).map(k => `${k}=${query[k]}`).join('&')}`
        return (path.startsWith(this.url) && path.endsWith(this.query))
      }
    },
    {
      url: '/staff-calendar',
      icon: '/assets/calender-icon.svg',
      label: 'Staff Calendar',
      roles: ['admin']
    },
    {
      url: '/coaching-call',
      icon: '/assets/phone-call-icon.svg',
      label: 'Coaching Call',
      roles: ['player']
    },
    {
      url: '/purchases',
      icon: '/assets/purchase-icon.svg',
      label: 'Purchases',
      roles: ['player', 'trainer']
    },
    {
      url: '/subscriptions',
      icon: '/assets/subscription-icon.svg',
      label: 'Subscriptions',
      roles: ['player', 'trainer']
    },
    {
      url: '/settings',
      icon: '/assets/setting-icon.svg',
      label: 'Settings',
      roles: ['player', 'trainer', 'staff', 'admin']
    },
  ]

  return (
    <div className={`bg-gray-900 pt-8 h-screen overflow-auto p-4 ${showSidebar ? 'w-80' : 'w-fit'} lg:w-80 ${showSidebar ? 'pl-12' : 'pl-4'} lg:pl-12 ${showSidebar ? 'absolute' : 'unset'} lg:unset`}>
      <div className={`${showSidebar ? 'hidden' : 'flex'} lg:hidden`} onClick={() => setShowSidebar(true)}>
        <Menu />
      </div>
      <div className={`${showSidebar ? 'flex' : 'hidden'} lg:flex`}>
        <div className="w-62">
          <div className="flex items-center mb-6">
            <img src="/assets/spinlab-log.png" alt="Logo" className="w-48	" />
          </div>
          <div className={`${(userSession.role === 'staff' || userSession.role === 'admin') && profileStyle.profile} flex items-center space-x-2 mb-8 rounded-lg ${pathname === '/profile' && `bg-primary p-2`}`} onClick={(userSession.role === 'staff' || userSession.role === 'admin') && (() => route.replace('/profile')) || undefined}>
            <img
              src={user?.avatarUrl ? user.avatarUrl : "https://placehold.co/100x100"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className={`font-semibold ${pathname === '/profile' && 'text-black'}`}>{userSession.name} ({userSession.role})</p>
              <p className={`text-sm ${pathname === '/profile' ? 'text-black' : 'text-zinc-400'}`}>{userSession.email}</p>
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
            {links.filter(link => link.roles.includes(userSession.role)).map((link, index) => (
              <Link key={index} href={`${link.url}${link.query || ''}`} className={linkClasses(link.url, link.pathValidator?.bind(link))}>
                <img
                  src={link.icon}
                  className={svgClasses(link.url, link.pathValidator?.bind(link))}
                  alt=""
                  width={20}
                  height={20}
                />
                <span className="flex items-center p-1.5 pl-4 text-inherit">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
