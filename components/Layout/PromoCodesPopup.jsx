// components/EditUserModal.js
import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton, TextField, MenuItem, Snackbar, MobileStepper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { convertCmToFeetAndInches, convertFeetAndInchesToCm, convertMsToRelativeTime } from "@/util/utils";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import 'swiper/css';
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { useApp } from "../Context/AppContext";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
    py: 4,
    px: 2,
    borderRadius: "8px",
    maxHeight: '80vh',
    overflow: 'auto'
};

const PromoCodesPopup = () => {
    const popupExpiration = localStorage.getItem('popupExpiration') || new Date().getTime()
    if (popupExpiration <= new Date().getTime()) localStorage.setItem('popupExpiration', new Date().getTime() + 86400000)

    const { user } = useApp()
    const [open, setOpen] = useState(popupExpiration <= new Date().getTime() ? true : false)
    const [promocodes, setPromocodes] = useState()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        axios.get('/api/promocodes/popup').then(res => setPromocodes(res.data)).catch(console.error)
    }

    const onClose = () => setOpen(false)

    return (
        user && ['player', 'trainer'].includes(user.role) && promocodes && promocodes.length > 0 &&
        <Modal open={open} onClose={onClose} aria-labelledby="upload-modal-title">
            <Box sx={style} className="w-full max-w-md md:max-w-3xl blueBackground">
                <IconButton
                    style={{ position: "absolute", top: 10, right: 10, color: '#fff', zIndex: 10 }}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
                <Swiper
                    loop={true}
                    autoplay={{
                        delay: 2500,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    spaceBetween={50}
                    slidesPerView={1}
                >
                    {promocodes.map(promocode => (
                        <SwiperSlide>
                            <div className={`flex flex-col gap-8 ${promocodes.length > 1 && 'mb-8'} mx-14`}>
                                <p className="flex justify-center text-xl md:text-2xl font-bold">
                                    Don't Miss Out...
                                </p>
                                <p className="flex justify-center text-2xl md:text-4xl font-bold text-primary">
                                    {promocode.description}
                                </p>
                                <p className="flex justify-center text-center text-base md:text-lg font-bold">
                                    Use the promo code below and {(promocode.type === 'purchase_discount' && `save ${promocode.discountPercentage}% on your next purchase`) || (promocode.type === 'free_credits' && `claim ${promocode.claimCredits} free credits`)}
                                </p>
                                <div className="flex justify-center text-4xl font-bold swiper-no-swiping">
                                    <p className="text-2xl md:text-4xl font-bold dark-blue-background border-green-500 border-2 border-dashed px-4 py-2 ">
                                        {promocode.code}
                                    </p>
                                </div>
                                <div className="flex flex-col md:flex-row items-center justify-between">
                                    <p className="text-primary">Expires in {convertMsToRelativeTime(new Date(promocode.expirationDate).getTime() - new Date().getTime())}</p>
                                    <p className="text-primary">{promocode.uses - promocode.products.length} uses left!</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
        </Modal>
    );
};

export default PromoCodesPopup;
