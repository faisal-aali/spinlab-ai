"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { signOut, useSession, signIn } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FiLogOut } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import HeaderProfile from "../Common/HeaderProfile/HeaderProfile";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  SnackbarContent,
  Tooltip,
  Typography,
  Modal
} from "@mui/material";
import { Person } from "@mui/icons-material";
import UploadModal from "../Dashboard/DashboardComponents/UploadVideoModal/UploadModal";
import UpdateEmailModal from "../Dashboard/DashboardComponents/UpdateEmailModal/UpdateEmailModal";
import {
  Warning as WarningIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useApp } from "../Context/AppContext";
import axios from 'axios';
import * as Yup from 'yup'
import { Field, Form, Formik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
  maxHeight: '90vh',
  overflow: 'auto'
};
const SwitchAccountModal = ({ open, onClose }) => {
  const router = useRouter()
  const { user } = useApp()
  const [error, setError] = useState()
  const [showPassword, setShowPassword] = useState()

  const RegisterAccount = () => {

    const handleSubmit = (values) => {
      axios.post('/api/trainers', {
        email: values.email,
        password: values.password,
        name: user.name,
        city: user.city,
        country: user.country,
        avatarUrl: user.avatarUrl,
      }).then(() => {
        // signOut({ redirect: false }).then(() => {
        signIn('credentials', {
          email: values.email,
          password: values,
          redirect: false
        }).then(() => router.replace('/dashboard')).catch(err => setError('Error occured signing in'))
        // }).catch(err => setError('Error occured signing out'))
      }).catch(err => {
        setError(`Error occured: ${err.response.data?.message || err.message}`)
      })
    }

    const schema = Yup.object().shape({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required("Required"),
      confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Required"),
    });

    return (
      <Formik
        initialValues={{
          email: '',
          password: '',
          confirmPassword: ''
        }}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="w-full p-8">
            <div className="flex flex-col w-full gap-4">
              <div className="w-full">
                <div className="mb-1 opacity-45">
                  <label htmlFor="">Email</label>
                </div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`w-full py-3 px-3 bg-transparent primary-border rounded text-white rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45  ${errors.email && touched.email
                    ? "border-red-900 border"
                    : "primary-border focus:border-green-500"
                    }`}
                />
              </div>
              <div>
                <div className="mb-1 opacity-45">
                  <label htmlFor="">New Password</label>
                </div>
                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className={`w-full py-3 px-3 dark-blue-background rounded-lg text-primary focus:outline-none placeholder:opacity-45 ${errors.password && touched.password
                      ? "border-red-900 border"
                      : "primary-border focus:border-green-500"
                      }`}
                    placeholder="Enter new password"
                  />
                  <div
                    className="absolute inset right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-white"
                    onClick={() => setShowPassword(v => !v)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-1 opacity-45">
                  <label htmlFor="">Confirm Password</label>
                </div>
                <div className="relative">
                  <Field
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    className={`w-full py-3 px-3 dark-blue-background rounded-lg text-primary focus:outline-none placeholder:opacity-45 ${errors.confirmPassword && touched.confirmPassword
                      ? "border-red-900 border"
                      : "primary-border focus:border-green-500"
                      }`}
                    placeholder="Confirm"
                  />
                  <div
                    className="absolute inset right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-white"
                    onClick={() =>
                      setShowPassword(v => !v)
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>
              {error ? <div className="text-red-500 text-sm">{error}</div> : null}
              <button type="submit" className="w-full bg-green-500 bg-primary rounded-lg text-black font-normal py-3 rounded hover-shadow focus:outline-none">SWITCH</button>
              <button onClick={onClose}>CANCEL</button>
            </div>
          </Form>
        )}
      </Formik>
    )
  }

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="upload-modal-title">
      <Box
        sx={style}
        className="w-full max-w-2xl min-h-96 flex justify-center"
        style={{ backgroundColor: "rgba(9, 15, 33, 1)" }}
      >
        <IconButton className="!primary-border-parrot"
          style={{ position: "absolute", top: 20, right: 20, color: "#fff", padding: "3px" }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

      </Box>
    </Modal>
  )
}

const ProfileMenu = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { data: session } = useSession();
  const [openSwitchAccount, setOpenSwitchAccount] = useState(false)
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/login");
    Cookies.remove("loggedin");
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton
          onClick={(e) => setAnchorElUser(e.currentTarget)}
          sx={{ p: 0.5, bgcolor: "white", ":hover": { bgcolor: "white" } }}
        >
          <Person fontSize="medium" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorElUser)}
        onClose={() => setAnchorElUser(null)}
      >
        <MenuItem
          disableRipple
          sx={{ display: session?.user?.role === "staff" ? "flex" : "none" }}
        >
          <Grid container flexDirection={"column"} gap={1}>
            <Grid item>
              <Typography textAlign="center" color={"white"}>
                Viewing As
              </Typography>
            </Grid>
            <Grid item container gap={1}>
              <Grid item>
                <Button
                  variant={
                    session?.user?.role === "staff" ? "contained" : "outlined"
                  }
                  size="small"
                  onClick={() => setOpenSwitchAccount(true)}
                >
                  Staff
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant={
                    session?.user?.role === "trainer" ? "contained" : "outlined"
                  }
                  size="small"
                  onClick={() => setOpenSwitchAccount(true)}
                >
                  Trainer
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleLogout();
            setAnchorElUser(null);
          }}
        >
          <Typography textAlign="center" color={"white"}>
            Logout
          </Typography>
          <FiLogOut className="text-primary text-lg cursor-pointer ml-2" />
        </MenuItem>
      </Menu>
      <SwitchAccountModal open={openSwitchAccount} onClose={() => setOpenSwitchAccount(false)} />
    </Box >
  );
};

const Layout = ({ children }) => {
  const router = useRouter();
  const user = useSession().data?.user || {};
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showUpdateEmailModal, setShowUpdateEmailModal] = useState(false);

  useEffect(() => {
    if (!user.role) router.replace("/login");
    else if (!user.emailVerified)
      setSnackbarOpen(true);
  }, [user]);

  useEffect(() => {
    setShowSidebar(false);
  }, [pathname]);

  return (
    <div className="flex flex-row h-screen">
      <div className="z-20 w-fit">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      </div>
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className={`bg-black opacity-50 absolute w-screen h-screen z-10 top-0 left-0 right-0 bottom-0`}
        ></div>
      )}
      <div className="flex-1 py-8 px-8 dashboard-background w-4/5 h-screen overflow-auto">
        <div className="flex justify-end">
          <div className="flex justify-between items-center mb-8 right-10 top-12 ml-auto z-10">
            <div className="flex space-x-4 items-center">
              <button
                onClick={() => setShowUploadModal(true)}
                className={`bg-white text-black px-5 py-1 rounded-lg ${user.role === "trainer" && "hidden"
                  }`}
              >
                UPLOAD
              </button>
              <button
                className={`bg-white text-black px-5 py-1 rounded-lg ${user.role === "admin" && "hidden"
                  }`}
              >
                PURCHASE
              </button>
              <div className="flex">
                <IoNotificationsOutline className="mr-4 text-primary text-3xl cursor-pointer" />
                <ProfileMenu key={"ProfileMenu"} />
              </div>
            </div>
          </div>
        </div>
        <div className="-mt-0 lg:-mt-[65px]">
          {((user.role === "trainer" &&
            [
              "/dashboard",
              "/add-player",
              "/players-history",
              "/players-metrics",
              "/metrics",
            ].includes(pathname)) ||
            (user.role === "player" && ["/dashboard"].includes(pathname)) ||
            (user.role === "staff" &&
              ["/dashboard", "/users", "/users/view"].includes(pathname)) ||
            (user.role === "admin" &&
              ["/dashboard", "/users", "/users/view"].includes(pathname))) && (
              <div>
                <HeaderProfile />
              </div>
            )}
          {children}
        </div>
      </div>
      <UploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        type={'upload'}
      />

      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        onClick={() => setShowUpdateEmailModal(true)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ width: "30%", cursor: "pointer" }}
      >
        <SnackbarContent
          message={
            <span
              className="text-yellow-300"
              style={{ display: "flex", alignItems: "center" }}
            >
              <WarningIcon
                style={{ marginRight: 8 }}
                className="text-yellow-300"
              />
              Please verify your email
            </span>
          }
          action={
            <IconButton color="inherit">
              <ArrowForwardIcon />
            </IconButton>
          }
          sx={{
            width: "100%",
            backgroundColor: "black",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow:
              "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
          }}
        />
      </Snackbar>
      {showUpdateEmailModal && <UpdateEmailModal open={showUpdateEmailModal} onClose={() => setShowUpdateEmailModal(false)} isVerification={user.emailVerified ? false : true} />}
    </div>
  );
};

export default Layout;
