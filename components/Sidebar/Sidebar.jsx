"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import user from '../../util/user'
import profileStyle from './sidebar.module.css'

const links = [
  {
    url: '/dashboard',
    icon: '/assets/dashboard-icon.svg',
    label: 'Dashboard',
    roles: ['player', 'trainer', 'coach']
  },
  {
    url: '/leaderboard',
    icon: '/assets/dashboard-icon.svg',
    label: 'Leaderboard',
    roles: ['player', 'trainer', 'coach', 'admin']
  },
  {
    url: '/drill-library',
    icon: '/assets/drill-library-icon.svg',
    label: 'Drill Library',
    roles: ['player', 'trainer', 'coach', 'admin']
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
    url: '/players',
    icon: `/assets/${user.role === 'coach' ? 'dashboard-icon.svg' : user.role === 'admin' ? 'add-player-icon.svg' : ''}`,
    label: user.role === 'coach' ? 'Players Database' : user.role === 'admin' ? 'Manage Player Database' : 'Invalid role',
    roles: ['coach', 'admin']
  },
  {
    url: '/coaches',
    icon: '/assets/add-player-icon.svg',
    label: 'Manage Coach Database',
    roles: ['admin']
  },
  {
    url: '/trainers',
    icon: '/assets/add-player-icon.svg',
    label: 'Manage Trainer Database',
    roles: ['admin']
  },
  {
    url: '/calender',
    icon: '/assets/calender-icon.svg',
    label: user.role === 'coach' ? 'My Calender' : user.role === 'admin' ? 'Coach Calender' : 'Invalid role',
    roles: ['coach', 'admin']
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
    roles: ['player', 'trainer', 'coach', 'admin']
  },
]

const Sidebar = () => {
  const pathname = usePathname();
  const route = useRouter()

  const linkClasses = (path) =>
    `flex pl-2 py-1 ${pathname === path ? "bg-primary rounded-lg w-10/12 items-center text-black" : ""
    }`;

  const svgClasses = (path) =>
    `${pathname === path ? "mix-blend-difference" : "fill-current text-white"}`;

  return (
    <div className="bg-gray-900 text-white w-80 pt-8 pl-12 min-h-screen p-4">
      <div className="w-62">
        <div className="flex items-center mb-6">
          <img src="/assets/spinlab-log.png" alt="Logo" className="w-48	" />
        </div>
        <div className={`${(user.role === 'coach' || user.role === 'admin') && profileStyle.profile} flex items-center space-x-2 mb-8 rounded-lg ${pathname === '/profile' && `bg-primary p-2`}`} onClick={(user.role === 'coach' || user.role === 'admin') && (() => route.replace('/profile'))}>
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
          {links.filter(link => link.roles.includes(user.role)).map(link => (
            <Link href={link.url} className={linkClasses(link.url)}>
              <img
                src={link.icon}
                className={svgClasses(link.url)}
                alt=""
              />
              <span className="flex items-center p-2">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
