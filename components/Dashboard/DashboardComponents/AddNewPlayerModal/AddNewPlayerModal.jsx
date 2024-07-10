// components/UploadModal.js
import React, { useEffect } from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { blueGrey } from "@mui/material/colors";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px"
};

const AddNewPlayerModal = ({ open, onClose }) => {
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
      <Box sx={style} className="w-full max-w-2xl blueBackground">
        <IconButton style={{ position: 'absolute', top: 10, right: 10 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <h2 className="text-2xl font-bold mb-8 text-center">To add a new player, please enter the details below.</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="grid gap-2">
            <p>First Name</p>
            <input
              className="w-full bg-transparent px-3 rounded-lg py-3 text-white primary-border rounded focus:outline-none focus:border-green-500 placeholder:opacity-45"
              type="text"
              name="firstName"
              required
            />
          </div>
          <div className="grid gap-2">
            <p>Last Name</p>
            <input
              className="w-full bg-transparent px-3 rounded-lg py-3 text-white primary-border rounded focus:outline-none focus:border-green-500 placeholder:opacity-45"
              type="text"
              name="lastName"
              required
            />
          </div>
          <div className="grid gap-2">
            <p>Height</p>
            <input
              className="w-full bg-transparent px-3 rounded-lg py-3 text-white primary-border rounded focus:outline-none focus:border-green-500 placeholder:opacity-45"
              type="text"
              name="height"
              required
            />
          </div>
          <div className="grid gap-2">
            <p>Weight</p>
            <input
              className="w-full bg-transparent px-3 rounded-lg py-3 text-white primary-border rounded focus:outline-none focus:border-green-500 placeholder:opacity-45"
              type="text"
              name="weight"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="border-2 border-dashed border-green-500 p-8 rounded-lg text-center cursor-pointer">
            <CloudUploadIcon className="text-green-500 mb-2" fontSize="large" />
            <Typography className="text-green-500 mb-2">
              <strong>Click to Upload</strong> or drag and drop
            </Typography>
            <Typography>MP4 or HD (Recommended size 1000x1000px)</Typography>
            <Button variant="contained" color="primary" className="mt-4">
              UPLOAD
            </Button>
          </div>
          <div className="flex justify-center mb-10">
            <button className="bg-primary text-black rounded w-36 h-8 flex items-center justify-center text-base" >
              SUBMIT
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AddNewPlayerModal;
