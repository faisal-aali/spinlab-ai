// components/UploadModal.js
import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
  maxHeight: '90vh',
  overflow: 'auto'
};

const UploadModal = ({ open, onClose, onSuccess }) => {
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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

  const handleRecordModalOpen = () => {
    setRecordModalOpen(true);
    onClose();
  };

  const handleRecordModalClose = () => {
    setRecordModalOpen(false);
  };

  const interval = useRef()
  const handleUploadVideo = () => {
    setIsUploading(true);
    setUploadProgress(0);
    interval.current = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval.current);
          setIsUploading(false);
          setUploadSuccess(true);
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleCancelUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setRecordModalOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={onClose} aria-labelledby="upload-modal-title">
        <Box
          sx={style}
          className="w-full max-w-2xl min-h-96 flex justify-center"
          style={{ backgroundColor: "rgba(9, 15, 33, 1)" }}
        >
          <IconButton className="!primary-border-parrot"
            style={{ position: "absolute", top: 20, right: 20, color: "#fff", padding: "3px" }}
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
                <span className="text-white mx-2 text-2xl">
                  or drag and drop
                </span>
              </div>
              <p className="text-white text-lg">
                MP4 or HD (Recommended size 1000x1000px)
              </p>
              <div className="flex justify-center mb-10">
                <button
                  className="bg-white dark-blue-color rounded-lg w-28 h-9 flex items-center justify-center text-base font-bold"
                  onClick={handleRecordModalOpen}
                >
                  UPLOAD
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      <Modal
        open={recordModalOpen}
        onClose={handleRecordModalClose}
        aria-labelledby="record-video-modal-title"
      >
        <Box
          sx={style}
          style={{ backgroundColor: "rgba(9, 15, 33, 1)" }}
          className="max-w-4xl w-full !py-16 min-h-96	flex items-center justify-center"
        >
          <IconButton className="!primary-border-parrot"
            style={{ position: "absolute", top: 20, right: 20, color: "#fff", padding: "3px" }}
            onClick={handleRecordModalClose}
          >
            <CloseIcon />
          </IconButton>
          {isUploading ? (
            <div className="flex flex-col items-center text-center gap-7	">
              <h2 className="text-3xl	mb-6 text-white">
                Please hold, your video is uploading
              </h2>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{
                  width: "100%",
                  marginBottom: 2,
                  borderRadius: "10px",
                  backgroundColor: "#32E1004D",
                  height: "10px",
                  ".MuiLinearProgress-bar": {
                    backgroundColor: "#32e100",
                  },
                }}
                className="bg-primary"
              />
              <button
                className="button-danger text-white px-4 py-1 rounded uppercase"
                onClick={handleCancelUpload}
              >
                Cancel
              </button>
            </div>
          ) : uploadSuccess ? (
            <div className="flex flex-col items-center text-center text-white gap-5">
              <IconButton className="w-24">
                <img src="assets/checkmark.png" alt="Success" />
              </IconButton>
              <h2 className="text-2xl text-white">
                Video Uploaded Successfully!
              </h2>
              <div className="flex justify-center mt-4">
                <button
                  className="bg-white dark-blue-color px-4 py-1 rounded font-bold uppercase"
                  onClick={() => setUploadSuccess(false)}
                >
                  Back
                </button>
                <button
                  className="px-4 py-1 rounded font-bold bg-primary dark-blue-color ml-4 uppercase hover-button-shadow"
                  onClick={() => {
                    handleRecordModalClose()
                    onSuccess && onSuccess()
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center text-white">
              <h2 className="text-4xl	mb-6">
                Here’s how to
                <span className="text-primary"> Record your Video!</span>
              </h2>
              <div className="px-8 py-6 primary-border rounded-3xl	">
                <div className="relative my-4" style={{ width: "31rem" }}>
                  <img
                    src="assets/record-video-picture.png"
                    alt="Record your Video"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-5 justify-center mt-8">
                  <button
                    className="bg-primary text-black rounded w-36 h-8 flex items-center justify-center text-base uppercase hover-button-shadow"
                    onClick={handleUploadVideo}
                  >
                    Upload Video
                  </button>
                  <button
                    className="bg-primary text-black rounded w-36 h-8 flex items-center justify-center text-base uppercase hover-button-shadow"
                    onClick={handleUploadVideo}
                  >
                    Record Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default UploadModal;
