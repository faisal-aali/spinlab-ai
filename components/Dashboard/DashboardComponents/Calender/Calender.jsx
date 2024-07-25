"use client"

import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Calender() {
    const [searchQuery, setSearchQuery] = useState('')

    const user = useSession().data?.user || {}
    const router = useRouter()

    return (
        <div className="flex flex-col gap-8">
            <div className="blueBackground p-4 primary-border rounded-lg flex items-center justify-between mb-4 h-32 w-full xl:w-3/5">
                <div className="flex gap-5 items-center">
                    <div className="ml-4">
                        <h2 className="font-normal">{user.role === 'admin' ? 'Staff Calendar' : 'Your Calendar'}</h2>
                    </div>
                </div>
            </div>
            <div className={`${user.role !== 'admin' && 'hidden'}`}>
                <IconButton className="!border !primary-border-parrot !rounded" onClick={() => router.back()}>
                    <img src="/assets/back-icon.svg" />
                </IconButton>
            </div>
            <div className="search-bar w-full max-w-[580px]">
                <input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-2 py-1 rounded-lg text-white h-12 search-background focus:outline-none focus:ring-1 focus:ring-green-500"
                />
            </div>
            <div className='w-1/2'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDateTimePicker sx={{ backgroundColor: 'white' }} className='rounded-lg' defaultValue={dayjs('2022-04-17T15:30')} />
                </LocalizationProvider>
            </div>
        </div>
    )
}