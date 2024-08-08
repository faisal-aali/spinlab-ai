import React, { useEffect, useRef } from "react";
import { Modal, Box, IconButton, MenuItem, TextField, Checkbox } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import axios from 'axios';
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
  categoryId: Yup.string().required("Required"),
  videoLink: Yup.string().url("Invalid URL").required("Required"),
  title: Yup.string().required("Required"),
  isFree: Yup.boolean().required("Required"),
});


const AddVideoModal = ({ open, onClose, categories, initialCategory, onSuccess }) => {
  const formikRef = useRef();
  const { showSnackbar } = useApp();

  useEffect(() => {
    formikRef.current?.setFieldValue('categoryId', initialCategory)
  }, [initialCategory]);

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

  const addNewDrill = async (values, onClose) => {
    try {
      await axios.post("/api/drills", values);
      showSnackbar('Video has been added', 'success');
      onSuccess && onSuccess()
      onClose();
    } catch (err) {
      showSnackbar(err.response?.data?.message || err.message, 'error');
    }
  };

  const defaultCategoryId = initialCategory ? initialCategory : (categories.length > 0 ? categories[0]._id : '');

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
          <span>To Add a video to drill library, </span>Please enter the details below.
        </h2>
        <Formik
          innerRef={formikRef}
          initialValues={{
            categoryId: defaultCategoryId,
            videoLink: "",
            title: "",
            isFree: false,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => addNewDrill(values, onClose)}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="grid gap-2">
                  <div className="opacity-45">
                    <label htmlFor="categoryId">Category</label>
                  </div>
                  <TextField
                    name="categoryId"
                    select
                    fullWidth
                    variant="outlined"
                    value={values.categoryId}
                    onChange={(e) => setFieldValue('categoryId', e.target.value)}
                    InputProps={{ style: { height: 50 } }}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className='flex flex-row items-center gap-[12px]'>
                  <div>
                    <Checkbox
                      sx={{ width: 10, height: 10, color: '#FFFFFF30' }}
                      disableRipple
                      checked={values.isFree}
                      onChange={(e) => setFieldValue('isFree', e.target.checked)}
                    />
                  </div>
                  <div className="opacity-45">
                    <label>Free Video</label>
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="opacity-45">
                    <label htmlFor="videoLink">Youtube Link</label>
                  </div>
                  <Field
                    name="videoLink"
                    as="input"
                    type="text"
                    className={`w-full bg-transparent px-3 rounded-lg py-3 text-primary rounded focus:outline-none focus:border-green-500 placeholder:opacity-45
                      ${errors.videoLink && touched.videoLink
                        ? "border-red-900 border"
                        : "primary-border focus:border-green-500"
                      }`}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="opacity-45">
                    <label htmlFor="title">Title</label>
                  </div>
                  <Field
                    name="title"
                    as="textarea"
                    rows={5}
                    className={`w-full bg-transparent px-3 rounded-lg py-3 text-primary rounded focus:outline-none focus:border-green-500 placeholder:opacity-45
                      ${errors.title && touched.title
                        ? "border-red-900 border"
                        : "primary-border focus:border-green-500"
                      }`}
                  />
                </div>
              </div>
              <div className="flex justify-center mb-10 mt-6">
                <button
                  type="submit"
                  className="bg-primary dark-blue-color rounded w-28 h-9 flex items-center justify-center text-lg font-bold"
                >
                  SUBMIT
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default AddVideoModal;
