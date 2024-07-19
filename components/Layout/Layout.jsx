// components/Layout.js
"use client";
import Sidebar from "../Sidebar/Sidebar";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FiLogOut } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import HeaderProfile from '../Common/HeaderProfile/HeaderProfile'
import { useEffect, useMemo, useState } from "react";
import { Box, Button, Grid, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Person } from "@mui/icons-material";
import UploadModal from "../Dashboard/DashboardComponents/UploadVideoModal/UploadModal";

const ProfileMenu = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { data: session, update } = useSession();
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    setUserRole(localStorage.getItem('userRole'))
  })

  const handleLogout = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem("userSession");
    localStorage.removeItem("sessionExpiry");
    // router.replace("/login");
    Cookies.remove("loggedin");
  };

  const handleRoleChange = (newRole) => {
    console.log('handleRoleChange', newRole)
    update({
      user: {
        role: newRole
      }
    }).then(console.log).catch(console.error)
  }

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0.5, bgcolor: 'white', ':hover': { bgcolor: 'white' } }}>
          {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" /> */}
          <Person fontSize="medium" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{
          mt: '45px',
        }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={() => setAnchorElUser(null)}
      >
        <MenuItem disableRipple sx={{ display: userRole === 'staff' ? 'flex' : 'none' }}>
          <Grid container flexDirection={'column'} gap={1}>
            <Grid item>
              <Typography textAlign="center" color={'white'}>Viewing As</Typography>
            </Grid>
            <Grid item container gap={1}>
              <Grid item>
                <Button variant={session?.user?.role == 'staff' ? "contained" : 'outlined'} size="small" onClick={() => handleRoleChange('staff')}>Staff</Button>
              </Grid>
              <Grid item>
                <Button variant={session?.user?.role == 'trainer' ? "contained" : 'outlined'} size="small" onClick={() => handleRoleChange('trainer')}>Trainer</Button>
              </Grid>
            </Grid>
          </Grid>
        </MenuItem>
        <MenuItem onClick={() => {
          handleLogout()
          setAnchorElUser(null)
        }}>
          <Typography textAlign="center" color={'white'}>Logout</Typography>
          <FiLogOut
            className=" text-primary text-lg cursor-pointer ml-2"
          />
        </MenuItem>
      </Menu>
    </Box >
  )
}

const Layout = ({ children }) => {
  const user = useSession().data?.user || {}
  const router = useRouter();
  const pathname = usePathname()
  const [showSidebar, setShowSidebar] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)


  useEffect(() => {
    if (!user.role) router.replace('/login')
  }, [user]);

  useEffect(() => {
    setShowSidebar(false)
  }, [pathname]);

  return (
    <div className="flex flex-row min-h-screen">
      <div className="z-20 w-fit">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      </div>
      {showSidebar &&
        <div onClick={() => setShowSidebar(false)} className={`bg-black opacity-50 absolute w-screen h-screen z-10 top-0 left-0 right-0 bottom-0`}></div>
      }
      <div className="flex-1 py-8 px-8 dashboard-background w-4/5 max-h-screen overflow-auto">
        <div className="flex justify-end">
          <div className="flex justify-between items-center mb-8 right-10 top-12 ml-auto z-10">
            <div className="flex space-x-4 items-center">
              <button onClick={() => setShowUploadModal(true)} className={`bg-white text-black px-5 py-1 rounded-lg ${user.role === 'trainer' && 'hidden'}`}>
                UPLOAD
              </button>
              <button className={`bg-white text-black px-5 py-1 rounded-lg ${user.role == 'admin' && 'hidden'}`}>
                PURCHASE
              </button>
              <div className="flex">
                <IoNotificationsOutline className="mr-4 text-primary text-3xl cursor-pointer" />
                {/* <FiLogOut
                  onClick={handleLogout}
                  className=" text-primary text-3xl cursor-pointer"
                /> */}
                <ProfileMenu key={'ProfileMenu'} />
              </div>
            </div>
          </div>
        </div>
        <div className="-mt-0 lg:-mt-[65px]">
          {((user.role === 'trainer' && ['/dashboard', '/add-player', '/players-history', '/players-metrics', '/metrics'].includes(pathname))
            || (user.role === 'player' && ['/dashboard'].includes(pathname))
            || (user.role === 'staff' && ['/dashboard', '/users', '/users/view'].includes(pathname))
            || (user.role === 'admin' && ['/dashboard', '/users', '/users/view'].includes(pathname)))
            && <div>
              <HeaderProfile />
            </div>}
          {children}
        </div>
      </div>
      <UploadModal open={showUploadModal} onClose={() => setShowUploadModal(false)} />
    </div>
  );
};

export default Layout;
