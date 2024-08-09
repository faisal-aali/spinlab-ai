// components/UploadModal.js
import React, { useEffect, useRef, useState } from "react";
import { Modal, Box, IconButton, TextField, MenuItem } from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { convertFeetAndInchesToCm } from "@/util/utils";
import axios from 'axios'
import schemaValidators from "@/schema-validators";
import { useApp } from '../../../Context/AppContext';

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
  // email: Yup.string().email().required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  heightFt: Yup.number().required("Required"),
  heightIn: Yup.number().max(11).required("Required"),
  handedness: schemaValidators.user.handedness,
  weight: Yup.number().required("Required"),
});

const AddNewPlayerModal = ({ open, onClose, onSuccess }) => {
  const router = useRouter()

  const [response, setResponse] = useState({})
  const { showSnackbar } = useApp();
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState("");

  const timeout = useRef()
  useEffect(() => {
    if (response.message) {
      clearTimeout(timeout.current)
      timeout.current = setTimeout(() => setResponse({}), 3000);
    }
  }, [response])

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

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (values) => {
    return new Promise(async (resolve, reject) => { 
      let imageUrl = ""; 
      try {
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          const res = await axios.post("/api/S3", formData); 
          imageUrl = res.data.url; 
        }
  
        const data = {
          email: `player-${crypto.randomUUID().split('-').pop()}@random.com`,
          name: `${values.firstName} ${values.lastName}`,
          height: convertFeetAndInchesToCm(values.heightFt, values.heightIn),
          weight: values.weight,
          avatarUrl: imageUrl, 
        };
  
        await axios.post(`/api/players`, data);
        showSnackbar('Player added!', 'success');
        onSuccess && onSuccess();
        onClose();
        resolve();
      } catch (err) {
        showSnackbar(err.response?.data?.message || err.message, 'error');
        reject(err);
      }
    });
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="upload-modal-title">
      <Box sx={style} className="w-full max-w-2xl blueBackground">
        <IconButton
          style={{ position: "absolute", top: 10, right: 10, color: '#fff' }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <h2 className="text-2xl font-bold mb-8 text-center flex flex-col">
          <span>To Add a New Player, </span>Please enter the details below.
        </h2>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            heightFt: "",
            heightIn: "",
            weight: "",
            handedness: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values).then(() => {
              resetForm()
              router.push('/add-player')
            }).catch(console.error)
          }}
        >
          {({isSubmitting, errors, touched, setFieldValue, values }) => (
            <Form>
              <div className="grid grid-cols-2 gap-4 mb-4">
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
                <div className="grid gap-2 relative">
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
                <div className="grid gap-2 relative">
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
                <div className="grid gap-2">
                  <div className="opacity-45">
                    <label htmlFor="">Handedness</label>
                  </div>

                  <TextField error={Boolean(errors.handedness && touched.handedness)} variant="outlined" select value={values.handedness} InputProps={{ sx: { height: 50 } }} fullWidth onChange={(e) => setFieldValue('handedness', e.target.value)}>
                    <MenuItem value={'left'}>Left</MenuItem>
                    <MenuItem value={'right'}>Right</MenuItem>
                  </TextField>
                </div>
                {/* <div className={`grid gap-2`}>
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
                </div> */}
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-8 flex items-center justify-center flex-col rounded-lg w-full py-4 gap-4 border-dashed border-2 border-slate-800">
                  <div className="w-24">
                        {imageSrc && (
                          <img
                            src={imageSrc}
                            alt="Preview"
                            className="object-cover object-top
                            rounded-full w-[100px] h-[100px]"
                          />
                        )}
                      </div>
                  <label className="cursor-pointer flex items-center justify-center">
                    <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                    <img src="assets/upload-icon.svg" alt="" />
                  </label>
                  <div>
                    <span className="text-primary text-2xl">Click to Upload</span>
                    <span className="text-white mx-2 text-2xl">or drag and drop</span>
                  </div>
                </div>
              </div>
              {response.message && <div className={`flex justify-center col-span-2 mt-4 ${response.severity === 'success' ? 'text-primary' : 'text-error'}`}>{response.message}</div>}
              <div className="flex justify-center mt-4 mb-10">
              <button
                  type="submit"
                  className={`bg-primary dark-blue-color rounded w-28 h-9 flex items-center justify-center text-lg font-bold hover-button-shadow ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "SUBMIT"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default AddNewPlayerModal;
