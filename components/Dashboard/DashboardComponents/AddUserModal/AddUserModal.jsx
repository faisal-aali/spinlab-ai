import React, { useEffect, useRef, useState } from "react";
import { Modal, Box, IconButton, TextField, MenuItem, Snackbar, Alert } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import schemaValidators from "../../../../schema-validators";
import axios from "axios";
import { convertFeetAndInchesToCm } from "@/util/utils";

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

const AddUserModal = ({ open, onClose, role, onSuccess }) => {
  // const [selectedRole, setSelectedRole] = useState(role);
  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState("");
  // const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [response, setResponse] = useState({})

  const timeout = useRef()
  useEffect(() => {
    if (response.message) {
      clearTimeout(timeout.current)
      timeout.current = setTimeout(() => setResponse({}), 3000);
    }
  }, [response])

  // useEffect(() => {
  //   setSelectedRole(role);
  // }, [role]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleSubmit = async (values) => {
    return new Promise((resolve, reject) => {
      const data = {
        email: values.email,
        name: `${values.firstName} ${values.lastName}`,
        city: values.city,
        country: values.country,
        height: convertFeetAndInchesToCm(values.heightFt, values.heightIn),
        weight: values.weight,
        handedness: values.handedness,
      };

      axios.post(`/api/${(role === 'player' && 'players') || (role === 'trainer' && 'trainers') || (role === 'staff' && 'staff') || (role === 'admin' && 'admin')}`, data).then(res => {
        setResponse({
          severity: 'success',
          message: 'User added!'
        });
        onSuccess && onSuccess();
        resolve();
      }).catch(err => {
        setResponse({
          severity: 'error',
          message: err.response?.data?.message || err.message
        })
        reject(err);
      })
    })
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: schemaValidators.user.email,
    heightFt: role === 'player' && Yup.number().optional(),
    heightIn: role === 'player' && Yup.number().max(11).required("Required"),
    weight: role === 'player' && Yup.number().required("Required"),
    handedness: role === 'player' && schemaValidators.user.handedness,
  });

  // const handleSnackbarClose = () => {
  //   setSnackbarOpen(false);
  // };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="upload-modal-title">
      <Box sx={style} className="w-full max-w-3xl blueBackground px-16">
        <IconButton
          style={{ position: "absolute", top: 10, right: 10, color: '#fff' }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <h2 className="text-2xl font-bold mb-8 text-center flex flex-col">
          <span>To Add a New User, </span>Please enter the details below.
        </h2>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            heightFt: "",
            heightIn: "",
            weight: "",
            handedness: "",
            email: "",
            password: "",
            // role: role,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values).then(() => resetForm()).catch(console.error)
          }}

        >
          {({ errors, touched, setFieldValue, values }) => (
            console.log(errors),
            <Form>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="grid col-span-2 gap-2">
                  <div className="opacity-45">
                    <label htmlFor="">Profile Photo</label>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-center flex-col blueBackground rounded-lg w-full h-52 gap-4 border-dashed border-2 border-slate-800">
                      <label className="cursor-pointer flex items-center justify-center">
                        <input type="file" accept="image/*" className="hidden" />
                        <img src="/assets/upload-icon.svg" alt="" />
                      </label>
                      <div>
                        <span className="text-primary text-2xl">Click to Upload image</span>
                        <span className="text-white mx-2 text-2xl">or drag and drop</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="opacity-45">
                    <label htmlFor="">First Name</label>
                  </div>
                  <Field
                    className={`w-full text-primary bg-transparent px-3 rounded-lg py-3 text-white rounded focus:outline-none focus:border-green-500 placeholder:opacity-45
                    ${errors.firstName && touched.firstName
                        ? "border-red-900	border"
                        : "primary-border focus:border-green-500"
                      }`}
                    type="text"
                    name="firstName"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="opacity-45">
                    <label htmlFor="">Last Name</label>
                  </div>
                  <Field
                    className={`w-full text-primary bg-transparent px-3 rounded-lg py-3 text-white rounded focus:outline-none focus:border-green-500 placeholder:opacity-45
                    ${errors.lastName && touched.lastName
                        ? "border-red-900	border"
                        : "primary-border focus:border-green-500"
                      }`}
                    type="text"
                    name="lastName"
                    required
                  />
                </div>
                {role === 'player' &&
                  <div className={`grid gap-2 relative ${role !== 'player' && 'hidden'}`}>
                    <div className="opacity-45">
                      <label htmlFor="">Height</label>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Field
                          name="heightFt"
                          type='number'
                          className={`py-3 px-3 blueBackground rounded-lg w-full text-primary focus:outline-none placeholder:opacity-45 ${errors.heightFt && touched.heightFt
                            ? "border-red-900	border"
                            : "primary-border focus:border-green-500"
                            }`}
                        />
                        <div className="absolute bottom-3 right-4 opacity-50 text-white">ft</div>
                      </div>
                      <div className="relative">
                        <Field
                          name="heightIn"
                          type='number'
                          className={`py-3 px-3 blueBackground rounded-lg  w-full text-primary focus:outline-none placeholder:opacity-45 ${errors.heightIn && touched.heightIn
                            ? "border-red-900	border"
                            : "primary-border focus:border-green-500"
                            }`}
                        />
                        <div className="absolute bottom-3 right-4 opacity-50 text-white">in</div>
                      </div>
                    </div>
                  </div>}
                {role === 'player' &&
                  <div className={`grid gap-2 relative`}>
                    <div className="opacity-45">
                      <label htmlFor="">Weight</label>
                    </div>
                    <Field
                      className={`w-full text-primary bg-transparent px-3 rounded-lg py-3 text-white rounded focus:outline-none focus:border-green-500 placeholder:opacity-45
                    ${errors.weight && touched.weight
                          ? "border-red-900	border"
                          : "primary-border focus:border-green-500"
                        }`}
                      type="number"
                      name="weight"
                      required
                    />
                    <div className="absolute bottom-3 right-4 opacity-50 text-white">lbs</div>
                  </div>}
                {role === 'player' &&
                  <div className={`grid gap-2 ${role !== 'player' && 'hidden'}`}>
                    <div className="opacity-45">
                      <label htmlFor="">Handedness</label>
                    </div>
                    <TextField
                      variant="outlined"
                      select
                      fullWidth
                      value={values.handedness}
                      InputProps={{ style: { height: 50 } }}
                      onChange={(e) => setFieldValue('handedness', e.target.value)}
                      error={Boolean(errors.handedness && touched.handedness)}
                      helperText={errors.handedness && touched.handedness ? errors.handedness : ""}
                    >
                      <MenuItem value={'left'}>Left</MenuItem>
                      <MenuItem value={'right'}>Right</MenuItem>
                    </TextField>
                  </div>}
                <div className={`grid gap-2`}>
                  <div className="opacity-45">
                    <label htmlFor="">Email</label>
                  </div>
                  <Field
                    className={`w-full text-primary bg-transparent px-3 rounded-lg py-3 text-white rounded focus:outline-none focus:border-green-500 placeholder:opacity-45
                    ${errors.email && touched.email
                        ? "border-red-900	border"
                        : "primary-border focus:border-green-500"
                      }`}
                    type="text"
                    name="email"
                    required
                  />
                </div>
                {/* <div className="grid gap-2">
                  <div className="opacity-45">
                    <label htmlFor="">Subscription Plan</label>
                  </div>
                  <TextField variant="outlined" select defaultValue={'monthly'} fullWidth InputProps={{ style: { height: 50 } }} onChange={(e) => setFieldValue('plan', e.target.value)}>
                    <MenuItem value={'monthly'}>Monthly</MenuItem>
                    <MenuItem value={'annual'}>Annual</MenuItem>
                  </TextField>
                </div> */}
                {/* <div className="grid gap-2">
                  <div className="opacity-45">
                    <label htmlFor="">User Type</label>
                  </div>
                  <TextField variant="outlined" select defaultValue={'player'} fullWidth InputProps={{ style: { height: 50 } }} onChange={(e) => {
                    setSelectedRole(e.target.value)
                    setFieldValue('role', e.target.value)
                  }}>
                    <MenuItem value={'player'}>Player</MenuItem>
                    <MenuItem value={'staff'}>Staff</MenuItem>
                    <MenuItem value={'trainer'}>Trainer</MenuItem>
                  </TextField>
                </div> */}
              </div>
              {response.message && <div className={`flex justify-end col-span-2 mb-4 ${response.severity === 'success' ? 'text-primary' : 'text-error'}`}>{response.message}</div>}
              <div className="flex justify-end mb-10">
                <button type="submit" className="bg-primary dark-blue-color rounded w-28 h-9 flex items-center justify-center text-lg font-bold hover-button-shadow">
                  ADD
                </button>
              </div>
            </Form>
          )}
        </Formik>
        {/* <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar> */}
      </Box>
    </Modal >
  );
};

export default AddUserModal;
