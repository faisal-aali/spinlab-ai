// components/EditUserModal.js
import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton, TextField, MenuItem, Snackbar, MobileStepper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { convertCmToFeetAndInches, convertFeetAndInchesToCm } from "@/util/utils";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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

const CouponCodePopup = ({ open, onClose }) => {


    return (
        <Modal open={open} onClose={onClose} aria-labelledby="upload-modal-title">
            <Box sx={style} className="w-full max-w-3xl blueBackground">
                <IconButton
                    style={{ position: "absolute", top: 10, right: 10, color: '#fff' }}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
                <div className='flex flex-col gap-8'>
                    <p className="flex justify-center text-2xl font-bold">
                        Don't Miss Out...
                    </p>
                    <p className="flex justify-center text-4xl font-bold text-primary">
                        Take 30% off your next credits purchase!
                    </p>
                    <p className="flex justify-center text-lg font-bold">
                        Use the promo code below and save 30% on your next purchase
                    </p>
                    <div className="flex justify-center text-4xl font-bold">
                        <p className="text-4xl font-bold dark-blue-background border-green-500 border-2 border-dashed px-4 py-2 ">
                            SAVE30NOW
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <p>3 uses left!</p>
                        <p>Expires in 3 days 10 hours</p>
                    </div>
                    <div className="flex justify-center">
                        <MobileStepper
                            steps={3}
                            position="static"
                            activeStep={0}
                            sx={{
                                backgroundColor: 'transparent',
                                colorPrimary: {
                                    backgroundColor: "red",
                                },
                                '& .MuiMobileStepper-dot': {
                                    backgroundColor: 'white'
                                },
                                '& .MuiMobileStepper-dotActive': {
                                    backgroundColor: 'primary.main'
                                }
                            }}
                        />
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default CouponCodePopup;
