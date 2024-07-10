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
} from "@mui/material";
import Pagination from '../../../Common/Pagination/Pagination'

const data = Array.from({ length: 8 }).map((_, index) => ({
    id: index + 1,
    imageUrl: "/assets/player.png",
    firstName: index == 1 ? 'Drake' : 'James',
    lastName: index == 1 ? 'Johnson' : 'Anderson',
    date: "04/29/2024",
    efficiency: 85.9,
    sequencing: 85.9,
}));

const CustomLinearProgress = ({ value, color }) => {
    return (
        <Box sx={{ width: "100%" }}>
            <LinearProgress
                variant="determinate"
                value={value}
                sx={{
                    height: 3,
                    borderRadius: 0,
                    backgroundColor: "#E0E0E0",
                    "& .MuiLinearProgress-bar": {
                        backgroundColor: color,
                    },
                }}
            />
            <Typography variant="body2">
                {`${value.toFixed(2)}%`}
            </Typography>
        </Box>
    );
};

const PlayersHistory = () => {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('')

    const rowsPerPage = 5;

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const paginatedData = data.filter((player) => `${player.firstName} ${player.lastName}`.toLowerCase().match(searchQuery.toLowerCase())).slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    return (
        <div className="grid gap-4 py-8 ">
            <div className="flex justify-between">
                <div>
                    <h3>Players History</h3>
                </div>
                <div className="search-bar w-2/5">
                    <input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-2 py-1 rounded-lg text-white h-12 search-background focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                </div>
            </div>
            <div className="">
                <TableContainer component={Paper} className="bg-transparent">
                    <Table>
                        <TableHead className="leaderboard-table-head bg-primary-light uppercase">
                            <TableRow>
                                <TableCell className="text-white"></TableCell>
                                <TableCell className="text-white">Name</TableCell>
                                <TableCell className="text-white">Date</TableCell>
                                <TableCell className="text-white">Efficiency</TableCell>
                                <TableCell className="text-white">Sequencing</TableCell>
                                <TableCell className="text-white">Reports</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="leaderboard-table-body">
                            {paginatedData.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="text-white">
                                        <img
                                            src={row.imageUrl}
                                            alt={row.firstName}
                                            style={{ width: 50 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" className="text-white" fontWeight={'bold'}>
                                            {row.firstName} {row.lastName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="caption" className="text-white">
                                            {row.date}
                                        </Typography>
                                    </TableCell>
                                    <TableCell className="text-white">
                                        <CustomLinearProgress
                                            value={row.efficiency}
                                            color="#00FF00"
                                        />
                                    </TableCell>
                                    <TableCell className="text-white">
                                        <CustomLinearProgress
                                            value={row.sequencing}
                                            color="#00BFFF"
                                        />
                                    </TableCell>
                                    <TableCell className="text-white">
                                        <div className="grid grid-cols-2 items-center gap-4">
                                            <button className="bg-white text-black px-5 py-3 rounded-lg">
                                                DOWNLOAD PDF
                                            </button>
                                            <button className="bg-white text-black px-5 py-3 rounded-lg">
                                                VIEW HERE
                                            </button>
                                        </div>
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
            </div>
        </div >
    );
};

export default PlayersHistory;
