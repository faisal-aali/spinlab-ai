// components/UploadModal.js
import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, IconButton, TextField, MenuItem } from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { blueGrey } from "@mui/material/colors";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import schemaValidators from '../../../../schema-validators'

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

const validationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  heightFt: Yup.number().required("Required"),
  heightIn: Yup.number().max(11).required("Required"),
  weight: Yup.string().required("Required"),
  handedness: schemaValidators.user.handedness,
  email: schemaValidators.user.email,
  plan: Yup.string().required("Required"),
  role: Yup.string().required("Required"),
});

const AddUserModal = ({ open, onClose, role }) => {
  const [selectedRole, setSelectedRole] = useState(role)

  useEffect(() => {
    setSelectedRole(role)
  }, [role])

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
            plan: "",
            role: role,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values);
          }}
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
                <div className={`grid gap-2 relative ${selectedRole !== 'player' && 'hidden'}`}>
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
                <div className={`grid gap-2 relative ${selectedRole !== 'player' && 'hidden'}`}>
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
                </div>
                <div className={`grid gap-2 ${selectedRole !== 'player' && 'hidden'}`}>
                  <div className="opacity-45">
                    <label htmlFor="">Handedness</label>
                  </div>

                  <TextField variant="outlined" select fullWidth defaultValue={'left'} InputProps={{ style: { height: 50 } }} onChange={(e) => setFieldValue('handedness', e.target.value)}>
                    <MenuItem value={'left'}>Left</MenuItem>
                    <MenuItem value={'right'}>Right</MenuItem>
                  </TextField>
                  {/* <Field
                    className={`w-full text-primary bg-transparent px-3 rounded-lg py-3 text-white rounded focus:outline-none focus:border-green-500 placeholder:opacity-45
                    ${errors.handedness && touched.handedness
                        ? "border-red-900	border"
                        : "primary-border focus:border-green-500"
                      }`}
                    type="text"
                    as='select'
                    name="handedness"
                    required
                  >
                    <option
                      className="bg-black"
                      value={'left'}
                      label={'Left'}
                    />
                    <option
                      className="bg-black"
                      value={'right'}
                      label={'Right'}
                    />
                  </Field> */}
                </div>
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
                <div className="grid gap-2">
                  <div className="opacity-45">
                    <label htmlFor="">Subscription Plan</label>
                  </div>
                  <TextField variant="outlined" select defaultValue={'monthly'} fullWidth InputProps={{ style: { height: 50 } }} onChange={(e) => setFieldValue('plan', e.target.value)}>
                    <MenuItem value={'monthly'}>Monthly</MenuItem>
                    <MenuItem value={'annual'}>Annual</MenuItem>
                  </TextField>
                  {/* <Field
                    as='select'
                    name="plan"
                    className={`w-full py-3 px-3 text-primary bg-transparent rounded primary-border rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45`}
                  >
                    <option
                      className="bg-black"
                      value={'monthly'}
                      label={'Monthly'}
                    />
                    <option
                      className="bg-black"
                      value={'annual'}
                      label={'Annual'}
                    />
                  </Field> */}
                </div>
                <div className="grid gap-2">
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
                  {/* <Field
                    as='select'
                    name="role"
                    onChange={(e) => {
                      setSelectedRole(e.target.value)
                      setFieldValue('role', e.target.value)
                    }}
                    className={`w-full py-3 px-3 text-primary bg-transparent rounded rounded-lg primary-border focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45`}
                  >
                    <option
                      className="bg-black"
                      value={'player'}
                      label={'Player'}
                    />
                    <option
                      className="bg-black"
                      value={'staff'}
                      label={'Staff'}
                    />
                    <option
                      className="bg-black"
                      value={'trainer'}
                      label={'Trainer'}
                    />
                  </Field> */}
                </div>
              </div>
              <div className="flex justify-end mb-10">
                <button type="submit" className="bg-primary dark-blue-color rounded w-28 h-9 flex items-center justify-center text-lg font-bold hover-button-shadow">
                  ADD
                </button>
              </div>
            </Form>)}
        </Formik>
      </Box>
    </Modal>
  );
};

export default AddUserModal;
