import React, { useEffect } from "react";
import { Modal, Box, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

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

export default function VideoPlayer({ open, onClose, src }) {

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
                <video className="mt-6" src={src} width={'100%'} height={'100%'} autoPlay controls />
            </Box>
        </Modal>
    );
};
