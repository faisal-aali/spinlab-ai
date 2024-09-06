// components/UploadModal.js
import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import axios from "axios";
import { useApp } from "@/components/Context/AppContext";
import Recorder from './Recorder'
import { useRouter } from "next/navigation";

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

const UploadModal = ({ open, onClose, onSuccess, type, playerId }) => {
  const router = useRouter()
  const { showSnackbar, user, fetchUser } = useApp();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);
  const [recordVideo, setRecordVideo] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  // Function to convert data URL to Blob
  const dataURLToBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const getVideoThumbnail = (file) => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);

      // Create an offscreen video element
      const video = document.createElement('video');
      video.src = url;
      video.muted = true; // Ensure no audio plays
      video.playsInline = true; // For compatibility with some devices
      video.play();

      // Return a promise that resolves when the video is loaded
      video.addEventListener('canplay', () => {
        // Create an offscreen canvas element
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Set canvas dimensions to match the video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        console.log('video', video.videoWidth, video.videoHeight)

        // Draw the current video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get the thumbnail image as a data URL
        const thumbnailDataUrl = canvas.toDataURL('image/png');
        const blob = dataURLToBlob(thumbnailDataUrl)
        resolve(blob);

        // Clean up the object URL
        URL.revokeObjectURL(video.src);
      });
    });
  }

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("video/")) {
      handleUploadVideo(droppedFile)
    } else {
      showSnackbar("Please drop a valid video file.", "error");
    }
  };

  const handleUploadVideo = async (file) => {
    if (!file) return console.error('no file selected')
    if (!file.type.startsWith("video/")) return showSnackbar("Please drop a valid video file.", "error");
    setIsUploading(true);
    setUploadProgress(0);

    const thumb = await getVideoThumbnail(file)
    const data = new FormData()
    data.append('file', thumb, 'video-thumb.png')
    const thumbnailUrl = await axios.post('/api/S3', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    }).then(res => res.data.url).catch(err => {
      console.error(err);
      return null
    })
    const formData = new FormData()
    formData.append('file', file)
    if (thumbnailUrl) formData.append('thumbnailUrl', thumbnailUrl)
    if (playerId) formData.append('playerId', playerId)

    axios.post('/api/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      },
    }).then(res => {
      setIsUploading(false);
      setUploadSuccess(true)
    }).catch(err => {
      console.log('Error uploading file', err)
      showSnackbar(err.response.data?.message || err.message || 'Error uploading file. Please try again', 'error')
      setIsUploading(false);
      setUploadFailed(true)
    }).finally(() => {
      fetchUser()
    })
    // interval.current = setInterval(() => {
    //   setUploadProgress((prev) => {
    //     if (prev >= 100) {
    //       clearInterval(interval.current);
    //       setIsUploading(false);
    //       setUploadSuccess(true);
    //     }
    //     return prev + 10;
    //   });
    // }, 300);
  };

  const handleCancelUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
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
          {!user ? <div className="flex items-center justify-center"><CircularProgress /></div> :
            user.credits.remaining < 1 ? <div className="flex flex-col items-center justify-center gap-4">
              <img src="assets/failed.png" width={48} height={48} alt="Success" />
              <p className="text-2xl text-center">You are out of credits. Please purchase more in order to upload videos</p>
              <button className="bg-primary dark-blue-color w-48 rounded h-9 flex items-center justify-center text-lg font-bold hover-button-shadow" onClick={() => {
                router.push('/purchases')
                onClose()
              }}>Purchase Credits</button>
            </div> :
              <div className="flex items-center justify-center">
                {type === 'upload' && !isUploading && !uploadSuccess && !uploadFailed &&
                  <div className="grid grid-cols-1 gap-4"
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                    }}
                    onDrop={handleDrop}
                  >
                    <div className={`flex items-center justify-center flex-col rounded-lg w-full gap-4 ${isDragging ? "p-4 border-dashed border-2 border-green-500" : "border-slate-800"}`}>
                      <label className="cursor-pointer flex items-center justify-center">
                        <img src="assets/upload-icon.svg" alt="" />
                      </label>
                      <div className="text-center">
                        <span className="text-primary text-xl md:text-2xl">Click to Upload</span>
                        <span className="text-white mx-2 text-xl md:text-2xl">
                          or drag and drop
                        </span>
                      </div>
                      <p className="text-white text-base md:text-lg text-center">
                        MP4 or HD (Recommended size 1000x1000px)
                      </p>
                      <div className="flex justify-center mb-10">
                        <label className="bg-white text-black rounded w-36 h-8 flex items-center justify-center text-base uppercase cursor-pointer flex items-center justify-center">
                          <input type="file" accept="video/*" className="hidden" onChange={(e) => {
                            const file = e.target.files[0]
                            handleUploadVideo(file)
                          }} />
                          UPLOAD
                        </label>
                      </div>
                    </div>
                  </div>}
                {isUploading &&
                  <div className="flex flex-col items-center justify-center text-center gap-7	">
                    <h2 className="text-xl md:text-3xl	mb-6 text-white">
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
                  </div>}
                {uploadSuccess &&
                  <div className="flex flex-col items-center justify-center text-center text-white gap-5">
                    <IconButton className="w-24">
                      <img src="assets/checkmark.png" width={92} height={92} alt="Success" />
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
                          onSuccess && onSuccess()
                        }}
                      >
                        OK
                      </button>
                    </div>
                  </div>}
                {uploadFailed &&
                  <div className="flex flex-col items-center justify-center text-center text-white gap-5">
                    <img src="assets/failed.png" width={92} height={92} alt="Success" />
                    <h2 className="text-2xl text-white">
                      Sorry, the video has failed to upload. Please try again
                    </h2>
                    <div className="flex justify-center mt-4">
                      <button
                        className="bg-white dark-blue-color px-4 py-1 rounded font-bold uppercase"
                        onClick={() => {
                          setIsUploading(false)
                          setUploadFailed(false)
                        }}
                      >
                        Back
                      </button>
                    </div>
                  </div>}
                {type === 'record' && !recordVideo && !isUploading && !uploadSuccess && !uploadFailed &&
                  <div className="flex flex-col items-center text-center text-white">
                    <h2 className="text-lg md:text-4xl	mb-6">
                      Here's how to
                      <span className="text-primary"> Record your Video!</span>
                    </h2>
                    <div className="px-8 py-6 primary-border rounded-3xl	">
                      <div className="relative my-4">
                        <img
                          src="assets/record-video-picture.png"
                          alt="Record your Video"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex gap-5 justify-center mt-8">
                        {/* <button
                    className="bg-primary text-black rounded w-36 h-8 flex items-center justify-center text-base uppercase hover-button-shadow"
                    onClick={handleUploadVideo}
                  >
                    Upload Video
                  </button> */}
                        <button
                          className="bg-primary text-black block md:block rounded w-36 h-8 flex items-center justify-center text-base uppercase hover-button-shadow"
                          onClick={() => setRecordVideo(true)}
                        >
                          Record Now
                        </button>
                      </div>
                    </div>
                  </div>}
                {recordVideo && <Recorder onSubmit={(blob) => {
                  setRecordVideo(false)
                  handleUploadVideo(blob)
                }} />}
              </div>}
        </Box>
      </Modal>
    </>
  );
};

export default UploadModal;
