// components/EditUserModal.js
import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton, TextField, MenuItem, Snackbar  } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import schemaValidators from "@/schema-validators";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
  maxHeight: '90vh',
  overflow: 'auto'
};

const validationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  heightFt: Yup.number().required("Required"),
  heightIn: Yup.number().max(11).required("Required"),
  handedness: schemaValidators.user.handedness,
  weight: Yup.string().required("Required"),
  plan: Yup.string().required("Required"),
  role: Yup.string().required("Required"),
});

const EditUserModal = ({ open, onClose, role, userData }) => {
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
  }, [onClose]);

  const handleSubmit = async (values) => {
    try {
      const heightInCm = (values.heightFt * 30.48) + (values.heightIn * 2.54);
      const updatedData = {
        ...values,
        height: heightInCm,
        name: `${values.firstName} ${values.lastName}`
      };

      await axios.post(`/api/players/${userData._id}`, updatedData);
      onClose(); 
    } catch (error) {
      console.log(error);
    }
  };

  const heightFt = Math.floor(userData?.roleData?.height / 30.48); 
  const heightIn = Math.round((userData?.roleData?.height % 30.48) / 2.54); 

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
          Edit Details
        </h2>
        <Formik
          initialValues={{
            firstName: userData?.name.split(' ')[0] || "",
            lastName: userData?.name.split(' ')[1] || "",
            heightFt: heightFt || "",
            heightIn: heightIn ||"",
            weight: userData?.roleData.weight || "",
            handedness: userData?.roleData.handedness || "left",
            plan: userData?.plan || "monthly",
            role: userData?.role,
            password: ""
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}

        >
          {({ errors, touched, setFieldValue }) => (
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
                    className={`w-full bg-transparent px-3 rounded-lg py-3 text-white rounded focus:outline-none focus:border-green-500 placeholder:opacity-45
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
                    className={`w-full bg-transparent px-3 rounded-lg py-3 text-white rounded focus:outline-none focus:border-green-500 placeholder:opacity-45
                    ${errors.lastName && touched.lastName
                        ? "border-red-900	border"
                        : "primary-border focus:border-green-500"
                      }`}
                    type="text"
                    name="lastName"
                    required
                  />
                </div>
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
                </div>
                <div className={`grid gap-2 relative ${role !== 'player' && 'hidden'}`}>
                  <div className="opacity-45">
                    <label htmlFor="">Weight</label>
                  </div>
                  <Field
                    className={`w-full bg-transparent px-3 rounded-lg py-3 text-white rounded focus:outline-none focus:border-green-500 placeholder:opacity-45
                    ${errors.weight && touched.weight
                        ? "border-red-900	border"
                        : "primary-border focus:border-green-500"
                      }`}
                    type="number"
                    name="weight"
                    required
                  />
                  <div className="absolute bottom-3 right-4 opacity-50 text-white">lbs</div>
                </div>
                <div className={`grid gap-2 ${role !== 'player' && 'hidden'}`}>
                  <div className="opacity-45">
                    <label htmlFor="">Handedness</label>
                  </div>
                  <TextField variant="outlined" select fullWidth defaultValue={userData?.roleData.handedness} InputProps={{ style: { height: 50 } }} onChange={(e) => setFieldValue('handedness', e.target.value)}>
                    <MenuItem value={'left'}>Left</MenuItem>
                    <MenuItem value={'right'}>Right</MenuItem>
                  </TextField>
                </div>
                <div className="grid gap-2">
                  <div className="opacity-45">
                    <label htmlFor="">Subscription Plan</label>
                  </div>
                  <TextField variant="outlined" select defaultValue={'monthly'} fullWidth InputProps={{ style: { height: 50 } }} onChange={(e) => setFieldValue('plan', e.target.value)}>
                    <MenuItem value={'monthly'}>Monthly</MenuItem>
                    <MenuItem value={'annual'}>Annual</MenuItem>
                  </TextField>
                </div>
                <div className="grid gap-2">
                  <div className="opacity-45">
                    <label htmlFor="">User Type</label>
                  </div>
                  <TextField variant="outlined" select defaultValue={'player'} fullWidth InputProps={{ style: { height: 50 } }} onChange={(e) => setFieldValue('role', e.target.value)}>
                    <MenuItem value={'player'}>Player</MenuItem>
                    <MenuItem value={'staff'}>Staff</MenuItem>
                    <MenuItem value={'trainer'}>Trainer</MenuItem>
                  </TextField>
                </div>
              </div>
              <div className="flex justify-end mb-10 gap-4">
                <button type="button" className="bg-primary dark-blue-color uppercase rounded px-6 h-9 flex items-center justify-center text-lg font-bold hover-button-shadow">
                  Update Password
                </button>
                <button type="submit" className="bg-primary dark-blue-color rounded w-28 h-9 flex items-center justify-center text-lg font-bold hover-button-shadow">
                  UPDATE
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default EditUserModal;
