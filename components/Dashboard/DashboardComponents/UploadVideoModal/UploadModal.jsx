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
      <Box sx={style} className="w-full max-w-lg">
        <IconButton className="absolute top-2 right-2" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <Typography
          id="upload-modal-title"
          variant="h6"
          component="h2"
          className="text-center mb-4"
        >
          Upload Video
        </Typography>
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
      </Box>
    </Modal>
  );
};

export default UploadModal;
