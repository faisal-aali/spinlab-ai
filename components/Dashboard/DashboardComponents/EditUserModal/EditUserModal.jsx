// components/UploadModal.js
import React, { useEffect } from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { blueGrey } from "@mui/material/colors";
import { Field } from "formik";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

const EditUserModal = ({ open, onClose, role }) => {
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
          Edit Details
        </h2>
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
            <input
              className="w-full bg-transparent px-3 rounded-lg py-3 text-white primary-border rounded focus:outline-none focus:border-green-500 placeholder:opacity-45"
              type="text"
              name="firstName"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="opacity-45">
              <label htmlFor="">Last Name</label>
            </div>
            <input
              className="w-full bg-transparent px-3 rounded-lg py-3 text-white primary-border rounded focus:outline-none focus:border-green-500 placeholder:opacity-45"
              type="text"
              name="lastName"
              required
            />
          </div>
          <div className={`grid gap-2 ${role !== 'player' && 'hidden'}`}>
            <div className="opacity-45">
              <label htmlFor="">Height</label>
            </div>
            <input
              className="w-full bg-transparent px-3 rounded-lg py-3 text-white primary-border rounded focus:outline-none focus:border-green-500 placeholder:opacity-45"
              type="text"
              name="height"
              required
            />
          </div>
          <div className={`grid gap-2 ${role !== 'player' && 'hidden'}`}>
            <div className="opacity-45">
              <label htmlFor="">Weight</label>
            </div>
            <input
              className="w-full bg-transparent px-3 rounded-lg py-3 text-white primary-border rounded focus:outline-none focus:border-green-500 placeholder:opacity-45"
              type="text"
              name="weight"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="opacity-45">
              <label htmlFor="">Subscription Plan</label>
            </div>
            <select
              name="country"
              label
              className="w-full py-3 px-3 bg-transparent primary-border rounded text-primary rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45"
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
            </select>
          </div>
          <div className="grid gap-2">
            <div className="opacity-45">
              <label htmlFor="">User Type</label>
            </div>
            <select
              name="country"
              label
              className="w-full py-3 px-3 bg-transparent primary-border rounded text-primary rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45"
            >
              <option
                className="bg-black"
                value={'player'}
                label={'Player'}
              />
              <option
                className="bg-black"
                value={'coach'}
                label={'Coach'}
              />
              <option
                className="bg-black"
                value={'trianer'}
                label={'Trianer'}
              />
            </select>
          </div>
        </div>
        <div className="flex justify-end mb-10">
          <button className="bg-primary dark-blue-color rounded w-28 h-9 flex items-center justify-center text-lg font-bold">
            UPDATE
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default EditUserModal;
