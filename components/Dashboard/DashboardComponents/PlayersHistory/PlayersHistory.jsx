// src/components/History/History.js
"use client";
import React, { useEffect, useState } from "react";
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
    CircularProgress,
} from "@mui/material";
import Pagination from '../../../Common/Pagination/Pagination'
import axios from 'axios'
import { useSession } from "next-auth/react";
import VideoPlayer from "@/components/Common/VideoPlayer/VideoPlayer";

const CustomLinearProgress = ({ value, color }) => {
    return (
        <Box sx={{ width: "100%" }}>
            <Typography variant="body2">
                {`${value.toFixed(2)}%`}
            </Typography>
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
        </Box>
    );
};

const PlayersHistory = (props) => {
    const userSession = useSession().data?.user || {}
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('')
    const [players, setPlayers] = useState()
    const [videoSrc, setVideoSrc] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        axios.get('/api/users', { params: { trainerId: userSession._id, includeMetrics: 1 } }).then(res => setPlayers(res.data)).catch(console.error)
    }

    const rowsPerPage = 5;

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const paginatedData = players?.filter((player) => `${player.firstName} ${player.lastName}`.toLowerCase().match(searchQuery.toLowerCase())).slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    return (
        <div className="grid gap-4 py-8">
            <div className={`flex justify-between ${props.omitHeader && 'hidden'} mb-4`}>
                <div>
                    <h2 className="font-normal ml-1.5">Players History</h2>
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
            {!players ? <CircularProgress /> :
                <div className="">
                    <TableContainer component={Paper} className="!bg-transparent">
                        <Table>
                            <TableHead className="leaderboard-table-head bg-primary-light uppercase">
                                <TableRow>
                                    <TableCell className="!text-white"></TableCell>
                                    <TableCell className="!text-white">Name</TableCell>
                                    <TableCell className="!text-white">Joining Date</TableCell>
                                    <TableCell className="!text-white">Overall QB Rating</TableCell>
                                    <TableCell className="!text-white">Reports</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="!leaderboard-table-body">
                                {paginatedData.map((player) => (
                                    <TableRow key={player._id}>
                                        <TableCell className="!text-white">
                                            <img
                                                src={player.avatarUrl}
                                                alt={player.name}
                                                style={{ width: 50 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" className="!text-white !text-lg" fontWeight={'bold'}>
                                                {player.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" className="!text-white !text-lg">
                                                {new Date(player.creationDate).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell className="!text-white">
                                            <CustomLinearProgress
                                                value={player.metrics.stats?.performance.score3[0] || 0}
                                                color="#00FF00"
                                            />
                                        </TableCell>
                                        <TableCell className="!text-white">
                                            <div className="grid grid-cols-2 items-center gap-4">
                                                <button onClick={() => window.open(player.metrics.reportPdfUrl)} className={`bg-white text-black px-5 py-3 rounded-lg ${!player.metrics.reportPdfUrl && 'hidden'}`}>
                                                    DOWNLOAD PDF
                                                </button>
                                                <button onClick={() => setVideoSrc(player.metrics.overlayVideoUrl)} className={`bg-white text-black px-5 py-3 rounded-lg ${!player.metrics.overlayVideoUrl && 'hidden'}`}>
                                                    OVERLAY VIDEO
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
                        count={Math.ceil(players.length / rowsPerPage)}
                        onChange={handlePageChange}
                    />
                </div>}
            <VideoPlayer open={videoSrc ? true : false} onClose={() => setVideoSrc('')} src={videoSrc} />
        </div >
    );
};

export default PlayersHistory;
