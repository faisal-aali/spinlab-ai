'use client';
import { createTheme } from '@mui/material/styles';


const theme = createTheme({
    palette: {
        primary: {
            main: '#32E100',
            contrastText: 'white'
        },
        background: {
            paper: '#090F21',
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '5px',
                },
                contained: {
                    backgroundColor: 'rgb(50, 225, 0)',
                    color: '#020716',
                    ':hover': {
                        backgroundColor: 'rgb(50, 225, 0)',
                        color: '#020716',
                    }
                },
                outlined: {
                    // backgroundColor: 'white',
                    color: 'rgb(50, 225, 0)',
                    borderColor: 'rgb(50, 225, 0)',
                    ':hover': {
                        // backgroundColor: 'white',
                        color: 'rgb(50, 225, 0)',
                        borderColor: 'rgb(50, 225, 0)',
                    }
                }
            },
            defaultProps: {
                disableElevation: true,
                disableRipple: true,
            }
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: 'white'
                }
            }
        }
    }
});

export default theme;