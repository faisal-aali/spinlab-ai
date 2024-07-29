"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { signOut, useSession } from "next-auth/react";
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
  Modal,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import UploadModal from "../Dashboard/DashboardComponents/UploadVideoModal/UploadModal";
import {
  Warning as WarningIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
  maxHeight: "90vh",
  overflow: "auto",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  otp: Yup.string().when("step", {
    is: 2,
    then: Yup.string().required("OTP is required"),
  }),
});

const ProfileMenu = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { data: session, update } = useSession();
  const [userRole, setUserRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/login");
    Cookies.remove("loggedin");
  };

  const handleRoleChange = (newRole) => {
    console.log("handleRoleChange", newRole);
    update({
      user: {
        role: newRole,
      },
    })
      .then(console.log)
      .catch(console.error);
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
          sx={{ display: userRole === "staff" ? "flex" : "none" }}
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
                  onClick={() => handleRoleChange("staff")}
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
                  onClick={() => handleRoleChange("trainer")}
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
    </Box>
  );
};

const Layout = ({ children }) => {
  const router = useRouter();
  const user = useSession().data?.user || {};
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!user.role) router.replace("/login");
    else if (!user.emailVerified)
      setSnackbarOpen(true);
  }, [user]);

  useEffect(() => {
    setShowSidebar(false);
  }, [pathname]);

  const handleUpdateEmail = (values) => {
    // Handle sending email verification code here
    console.log("Email updated to:", values.email);
    setCurrentStep(2);
  };

  const handleSendCode = () => {
    // Handle sending code to email here
    setCurrentStep(3);
  };

  const handleVerifyOtp = (values) => {
    // Handle OTP verification here
    console.log("OTP code:", values.otp.join(""));
    setCurrentStep(4);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentStep(1); 
  };

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
                className={`bg-white text-black px-5 py-1 rounded-lg ${
                  user.role === "trainer" && "hidden"
                }`}
              >
                UPLOAD
              </button>
              <button
                className={`bg-white text-black px-5 py-1 rounded-lg ${
                  user.role === "admin" && "hidden"
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
      />

      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        onClick={() => setModalOpen(true)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ width: "30%" , cursor: "pointer"}}
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

      {/* Email Verify Modal */}

      <Modal open={modalOpen} onClose={() => handleCloseModal()}>
        <Box sx={style} className="w-full max-w-2xl blueBackground px-16">
          <IconButton
            style={{ position: "absolute", top: 10, right: 10, color: "#fff" }}
            onClick={() => handleCloseModal()}
          >
            <CloseIcon />
          </IconButton>
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-8 text-center flex flex-col">
                Please enter your email to receive a verification code.
              </h2>
              <Formik
                initialValues={{ email: "" }}
                validationSchema={validationSchema}
                onSubmit={(values) => handleUpdateEmail(values)}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div className={`grid gap-2`}>
                      <div className="opacity-45">
                        <label htmlFor="email">Email</label>
                      </div>
                      <Field
                        className={`w-full text-primary bg-transparent px-3 rounded-lg py-3 text-white rounded focus:outline-none focus:border-green-500 placeholder:opacity-45
                    ${
                      errors.email && touched.email
                        ? "border-red-900 border"
                        : "primary-border focus:border-green-500"
                    }`}
                        type="text"
                        name="email"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        type="button"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleCloseModal()}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="contained" color="primary">
                        Verify
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <p className="text-2xl mb-8 text-center flex flex-col">
                A code will be sent to your email.
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleCloseModal()}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSendCode()}
                >
                  Send Code
                </Button>
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-8 text-center flex flex-col">
                Enter the OTP code sent to your email.
              </h2>
              <Formik
                initialValues={{ otp: ["", "", "", "", "", ""] }}
                validationSchema={Yup.object({
                  otp: Yup.array().of(
                    Yup.string()
                      .matches(/^\d$/, "Must be exactly one digit")
                      .required("Required")
                  ),
                })}
                onSubmit={(values) => handleVerifyOtp(values)}
              >
                {({ values, handleChange, handleBlur, setFieldValue }) => (
                  <Form>
                    <div className="flex justify-center mb-4">
                      {values.otp.map((_, index) => (
                        <input
                          key={index}
                          name={`otp[${index}]`}
                          type="text"
                          maxLength="1"
                          onChange={(e) => {
                            const { value } = e.target;
                            if (/^\d$/.test(value) || value === "") {
                              setFieldValue(`otp[${index}]`, value);
                              if (value !== "" && e.target.nextSibling) {
                                e.target.nextSibling.focus();
                              }
                            }
                          }}
                          onBlur={handleBlur}
                          value={values.otp[index]}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Backspace" &&
                              !values.otp[index] &&
                              e.target.previousSibling
                            ) {
                              e.target.previousSibling.focus();
                            }
                          }}
                          autoComplete="off"
                          className="w-10 h-10 m-1 text-center text-black text-lg border border-gray-400 rounded"
                        />
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        type="button"
                        variant="outlined"
                        color="primary"
                        onClick={() => setCurrentStep(2)}
                      >
                        Resend Code
                      </Button>
                      <Button type="submit" variant="contained" color="primary">
                        Verify
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}

          {currentStep === 4 && (
            <div className="w-auto	">
              <h4 className="text-center">
                Your email has been verified!
              </h4>
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleCloseModal()}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Layout;
