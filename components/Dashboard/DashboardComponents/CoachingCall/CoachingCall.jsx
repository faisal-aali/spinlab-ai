"use client"

import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';

export default function CoachingCall() {
    const user = useSession().data?.user || {}

    return (
        <div className="flex flex-col gap-8">
            <div className="blueBackground p-4 primary-border rounded-lg flex items-center justify-between mb-4 h-32 w-full xl:w-3/5">
                <div className="flex gap-5 items-center">
                    <div className="ml-4">
                        <h2 className="font-normal">{user.role === 'player' ? 'Schedule your Call with a Coach' : 'Your Calendar'}</h2>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-2 gap-8'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDateTimePicker sx={{ backgroundColor: 'white' }} className='rounded-lg' defaultValue={dayjs('2022-04-17T15:30')} />
                </LocalizationProvider>
            </div>
        </div>
    )
}