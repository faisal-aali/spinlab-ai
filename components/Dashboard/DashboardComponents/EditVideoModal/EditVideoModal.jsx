import { useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CloseIcon from "@mui/icons-material/Close";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useApp } from '../../../Context/AppContext';
import { generateYoutubeEmbedUrl } from "@/util/utils";

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
  videoLink: Yup.string().required("Required"),
  title: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});

const EditVideoModal = ({ open, onClose, videoId, videoData, categories, onSuccess }) => {

  const { showSnackbar } = useApp();

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
      await axios.post(`/api/drills/${videoId}`, {
        ...values,
        videoLink: generateYoutubeEmbedUrl(values.videoLink)
      }).then(res => {
        showSnackbar('Changes Saved!', 'success');
        onSuccess && onSuccess();
        onClose();
      });
    } catch (err) {
      showSnackbar(err.response?.data?.message || err.message, 'error');
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-video-modal-title">
      <Box sx={style} className="w-full max-w-3xl blueBackground px-16">
        <IconButton
          style={{ position: "absolute", top: 10, right: 10, color: '#fff' }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <Formik
          initialValues={{
            categoryId: videoData?.categoryId || "",
            videoLink: videoData?.videoLink || "",
            title: videoData?.title || "",
            description: videoData?.description || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, values, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="grid gap-2">
                  <div className="opacity-45">
                    <label htmlFor="category">Category</label>
                  </div>
                  <TextField
                    variant="outlined"
                    select
                    fullWidth
                    InputProps={{ style: { height: 50 } }}
                    value={values.categoryId}
                    onChange={(e) => setFieldValue('categoryId', e.target.value)}
                  >
                    {categories.map(cat => (
                      <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="grid gap-2">
                  <div className="opacity-45">
                    <label htmlFor="videoLink">YouTube Link</label>
                  </div>
                  <Field
                    name="videoLink"
                    className={`w-full bg-transparent px-3 rounded-lg py-3 text-primary rounded focus:outline-none focus:border-green-500 placeholder:opacity-45 
                      ${errors.videoLink && touched.videoLink
                        ? "border-red-900	border"
                        : "primary-border focus:border-green-500"
                      }`}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="opacity-45">
                    <label htmlFor="title">Title</label>
                  </div>
                  <Field
                    className={`w-full bg-transparent px-3 rounded-lg py-3 text-primary rounded focus:outline-none focus:border-green-500 placeholder:opacity-45
                      ${errors.title && touched.title
                        ? "border-red-900	border"
                        : "primary-border focus:border-green-500"
                      }`}
                    name="title"
                    as='input'
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="opacity-45">
                    <label htmlFor="title">Description</label>
                  </div>
                  <Field
                    className={`w-full bg-transparent px-3 rounded-lg py-3 text-primary rounded focus:outline-none focus:border-green-500 placeholder:opacity-45
                      ${errors.description && touched.description
                        ? "border-red-900	border"
                        : "primary-border focus:border-green-500"
                      }`}
                    name="description"
                    as='textarea'
                    rows={5}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-center mb-10 mt-6">
                <button type="submit" className="bg-primary dark-blue-color rounded w-28 h-9 flex items-center justify-center text-lg font-bold hover-button-shadow" disabled={isSubmitting}>
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

export default EditVideoModal;