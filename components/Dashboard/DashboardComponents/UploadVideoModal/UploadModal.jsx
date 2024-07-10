// components/UploadModal.js
import React, { useEffect } from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

const UploadModal = ({ open, onClose }) => {
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
      <Box sx={style} className="w-full max-w-2xl	min-h-96	flex justify-center"  style={{ backgroundColor: "rgba(9, 15, 33, 1)"}}>
        <IconButton
          style={{ position: "absolute", top: 10, right: 10, color: "#fff" }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-center flex-col rounded-lg w-full gap-4">
            <label className="cursor-pointer flex items-center justify-center">
              <input type="file" accept="image/*" className="hidden" />
              <img src="assets/upload-icon.svg" alt="" />
            </label>
            <div>
              <span className="text-primary text-2xl">Click to Upload</span>
              <span className="text-white mx-2 text-2xl">or drag and drop</span>
            </div>
            <p className="text-white text-lg">
            MP4 or HD (Recommended size 1000x1000px)
            </p>
            <div className="flex justify-center mb-10">
              <button className="bg-white dark-blue-color rounded-lg w-28 h-9 flex items-center justify-center text-base font-bold">
                UPLOAD
              </button>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default UploadModal;
