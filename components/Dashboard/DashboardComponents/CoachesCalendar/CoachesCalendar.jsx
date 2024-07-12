// src/components/History/History.js
"use client";
import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    LinearProgress,
    IconButton,
} from "@mui/material";
import Pagination from '../../../Common/Pagination/Pagination'
import DeleteUserModal from '../DeleteUserModal/DeleteUserModal'
import AddUserModal from '../AddUserModal/AddUserModal'
import { useRouter, useSearchParams } from "next/navigation";

const data = Array.from({ length: 6 }).map((_, index) => ({
    id: index + 1,
    firstName: 'James',
    lastName: 'Anderson',
    imageUrl: '/assets/player.png',
    email: 'faisalali.ux@gmail.com',
    location: '04/29/2024',
    calls: 60
}));


const CoachesCalendar = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [page, setPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const rowsPerPage = 5;

    const role = searchParams.get('role')

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const paginatedData = data.filter(p => `${p.firstName} ${p.lastName}`.toLowerCase().match(searchQuery)).slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    return (
        <>
            <div className="flex flex-col py-8 gap-8">
                <div className="blueBackground p-4 primary-border rounded-lg flex items-center justify-between mb-4 h-32 mt-20 w-full xl:mt-8 xl:w-3/5">
                    <div className="flex gap-5 items-center">
                        <div className="ml-4">
                            <h2 className="font-normal">Coaches Calendar</h2>
                        </div>
                    </div>
                </div>
                <div className="flex w-2/5">
                    <div className="search-bar flex-1">
                        <input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-2 py-1 rounded-lg h-full text-white search-background focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </div>
                </div>
                <div className="">
                    <TableContainer component={Paper} className="!bg-transparent">
                        <Table>
                            <TableHead className="leaderboard-table-head bg-primary-light uppercase">
                                <TableRow>
                                    <TableCell className="!text-white"></TableCell>
                                    <TableCell className="!text-white">Name</TableCell>
                                    <TableCell className="!text-white">Email</TableCell>
                                    <TableCell className="!text-white">Location</TableCell>
                                    <TableCell className="!text-white">Monthly Calls</TableCell>
                                    <TableCell className="!text-white">View Calender</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="leaderboard-table-body">
                                {paginatedData.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="!text-white">
                                            <img
                                                src={row.imageUrl}
                                                alt={row.firstName}
                                                style={{ width: 54, height: 64 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" className="!text-white text-lg font-bold">
                                                {row.firstName} {row.lastName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" className="!text-white text-lg">
                                                {row.email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" className="!text-white text-lg">
                                                {row.location}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" className="!text-primary text-xl">
                                                {row.calls}
                                            </Typography>
                                        </TableCell>
                                        <TableCell className="!text-white">
                                            <IconButton onClick={() => router.push('/calender')}>
                                                <img src="/assets/open.svg" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Pagination
                        page={page}
                        count={Math.ceil(data.length / rowsPerPage)}
                        onChange={handlePageChange}
                    />
                    <DeleteUserModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
                    <AddUserModal open={showAddModal} onClose={() => setShowAddModal(false)} role={role} />
                </div>
            </div>
        </>
    );
};

export default CoachesCalendar;
