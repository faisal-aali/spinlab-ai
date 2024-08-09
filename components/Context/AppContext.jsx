"use client"
// components/Context/AppContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide'; // Import Slide component
import axios from 'axios'
import { useSession } from 'next-auth/react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const AppProvider = ({ children }) => {
    const userSession = useSession().data?.user || {}
    const [user, setUser] = useState()
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    useEffect(() => {
        fetchUser()
    }, [userSession])

    const fetchUser = (callback) => {
        console.log('fetchUser', userSession._id)
        if (userSession._id) {
            axios.get('/api/users', { params: { id: userSession._id } }).then(res => {
                setUser(res.data[0])
                callback && callback()
            }).catch(console.error)
        }
    }

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    const hideSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <AppContext.Provider value={{ showSnackbar, hideSnackbar, user, fetchUser }}>
            {children}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={hideSnackbar}
                TransitionComponent={(props) => <Slide {...props} direction="up" />}
            >
                <MuiAlert onClose={hideSnackbar} severity={snackbar.severity} elevation={6} variant="filled">
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>
        </AppContext.Provider>
    );
};

export default AppProvider;
