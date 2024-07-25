// components/UploadModal.js
import React, { useEffect } from "react";
import { Modal, Box, Typography, Button, IconButton, TextField, MenuItem } from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { blueGrey } from "@mui/material/colors";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

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
  category: Yup.string().required("Required"),
  youtubeLink: Yup.string().required("Required"),
  title: Yup.string().required("Required"),
});

const EditVideoModal = ({ open, onClose }) => {
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
        <Formik
          initialValues={{
            category: "",
            youtubeLink: "",
            title: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="grid gap-2">
                  <div className="opacity-45">
                    <label htmlFor="">Category</label>
                  </div>
                  <TextField variant="outlined" defaultValue={'fundamentals'} select fullWidth InputProps={{ style: { height: 50 } }} onChange={(e) => setFieldValue('category', e.target.value)}>
                    {[{
                      value: 'fundamentals',
                      label: 'Fundamentals',
                    }, {
                      value: 'exercises',
                      label: 'Exercises',
                    }, {
                      value: 'mobility',
                      label: 'Mobility',
                    }, {
                      value: 'footwork',
                      label: 'Footwork',
                    }, {
                      value: 'iq',
                      label: 'IQ',
                    }, {
                      value: 'drills',
                      label: 'Drills',
                    }].map(cat => (
                      <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
                    ))}
                  </TextField>
                  {/* <Field
                    name="category"
                    as='select'
                    className={`w-full bg-transparent px-3 rounded-lg py-3 text-primary rounded focus:outline-none focus:border-green-500 placeholder:opacity-45 
                      ${errors.category && touched.category
                        ? "border-red-900	border"
                        : "primary-border focus:border-green-500"
                      }`}
                    required
                  >
                    <option
                      className="bg-black"
                      value={'fundamentals'}
                      label={'Fundamentals'}
                    />
                    <option
                      className="bg-black"
                      value={'exercises'}
                      label={'Exercises'}
                    />
                    <option
                      className="bg-black"
                      value={'mobility'}
                      label={'Mobility'}
                    />
                    <option
                      className="bg-black"
                      value={'footwork'}
                      label={'Footwork'}
                    />
                    <option
                      className="bg-black"
                      value={'iq'}
                      label={'IQ'}
                    />
                    <option
                      className="bg-black"
                      value={'drills'}
                      label={'Drills'}
                    />
                  </Field> */}
                </div>
                <div className="grid gap-2">
                  <div className="opacity-45">
                    <label htmlFor="">Youtube Link</label>
                  </div>
                  <Field
                    name="youtubeLink"
                    className={`w-full bg-transparent px-3 rounded-lg py-3 text-primary rounded focus:outline-none focus:border-green-500 placeholder:opacity-45 
                      ${errors.youtubeLink && touched.youtubeLink
                        ? "border-red-900	border"
                        : "primary-border focus:border-green-500"
                      }`}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="opacity-45">
                    <label htmlFor="">Title</label>
                  </div>
                  <Field
                    className={`w-full bg-transparent px-3 rounded-lg py-3 text-primary rounded focus:outline-none focus:border-green-500 placeholder:opacity-45
                      ${errors.title && touched.title
                        ? "border-red-900	border"
                        : "primary-border focus:border-green-500"
                      }`}
                    name="title"
                    as='textarea'
                    rows={5}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-center mb-10 mt-6">
                <button type="submit" className="bg-primary dark-blue-color rounded w-28 h-9 flex items-center justify-center text-lg font-bold hover-button-shadow" onClick={onClose}>
                  SUBMIT
                </button>
              </div>
            </Form>)}
        </Formik>
      </Box>
    </Modal>
  );
};

export default EditVideoModal;
