// src/components/History/History.js
"use client";
import { Fragment, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Pagination from '../../../Common/Pagination/Pagination'
import axios from 'axios'
import { useSession } from "next-auth/react";
import VideoPlayer from "@/components/Common/VideoPlayer/VideoPlayer";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";

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

    const [showDetails, setShowDetails] = useState()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        axios.get('/api/users', { params: { trainerId: props.trainerId || userSession._id, includeMetrics: 1 } }).then(res => setPlayers(res.data)).catch(console.error)
    }

    const rowsPerPage = 5;

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const paginatedData = players?.filter((player) => `${player.name}`.toLowerCase().match(searchQuery.toLowerCase())).slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    return (
        <div className="grid gap-4 py-8">
            <div className={`flex flex-col md:flex-row gap-4 justify-between ${props.omitHeader && 'hidden'} mb-4`}>
                <div>
                    <h2 className="font-normal ml-1.5">Players History</h2>
                </div>
                <div className="search-bar w-full md:w-2/5">
                    <input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-2 py-1 rounded-lg text-white h-12 search-background focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                </div>
            </div>
            {!players ? <CircularProgress /> :
                <div className="overflow-auto">
                    <TableContainer component={Paper} className="!bg-transparent">
                        <Table>
                            <TableHead className="leaderboard-table-head bg-primary-light uppercase">
                                <TableRow>
                                    <TableCell className="!text-white"></TableCell>
                                    <TableCell className="!text-white">Name</TableCell>
                                    <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }} className="!text-white">Joining Date</TableCell>
                                    <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }} className="!text-white">Overall QB Rating</TableCell>
                                    <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }} className="!text-white">Reports</TableCell>
                                    <TableCell sx={{ display: { xs: 'table-cell', sm: 'table-cell', md: 'none' } }} className="!text-white">Details</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="!leaderboard-table-body">
                                {paginatedData.map((player, index) => (
                                    <Fragment key={index}>
                                        <TableRow>
                                            <TableCell className="!text-white min-w-28 md:min-w-40" sx={{ minWidth: 50 }}>
                                                <img
                                                    src={player.avatarUrl || '/assets/player.png'}
                                                    alt={player.name}
                                                    style={{ width: 50, height: 50, objectFit: 'cover' }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" className="!text-white !text-lg" fontWeight={'bold'}>
                                                    {player.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>
                                                <Typography variant="caption" className="!text-white !text-lg">
                                                    {new Date(player.creationDate).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }} className="!text-white min-w-60">
                                                <CustomLinearProgress
                                                    value={player.metrics.stats?.metrics?.overall_score || 0}
                                                    color="#00FF00"
                                                />
                                            </TableCell>
                                            <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }} className="!text-white min-w-60">
                                                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                                                    <button onClick={() => window.open(player.metrics.reportPdfUrl)} className={`bg-white text-black px-5 py-3 rounded-lg ${!player.metrics.reportPdfUrl && 'hidden'}`}>
                                                        DOWNLOAD PDF
                                                    </button>
                                                    <button onClick={() => setVideoSrc(player.metrics.overlayVideoUrl)} className={`bg-white text-black px-5 py-3 rounded-lg ${!player.metrics.overlayVideoUrl && 'hidden'}`}>
                                                        OVERLAY VIDEO
                                                    </button>
                                                </div>
                                            </TableCell>
                                            <TableCell sx={{ display: { xs: 'table-cell', sm: 'table-cell', md: 'none' } }} className="!text-white">
                                                <IconButton onClick={() => setShowDetails(v => v === index ? null : index)}>
                                                    {index === showDetails ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow sx={{ display: showDetails === index ? { xs: 'table-row', sm: 'table-row', md: 'none' } : 'none' }}>
                                            <TableCell colSpan={3} sx={{ padding: 0 }}>
                                                <Grid container gap={2} padding={2} className="blueBackground" justifyContent={'space-between'} flexDirection={'column'}>
                                                    <Grid item container gap={1} justifyContent={'space-evenly'}>
                                                        <Grid item container flexDirection={'column'} xs>
                                                            <Grid item>
                                                                <Typography className="!text-sm !font-bold">Joining Date</Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <Typography variant="caption" className="!text-white !text-lg">
                                                                    {new Date(player.creationDate).toLocaleDateString()}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item container flexDirection={'column'} xs>
                                                            <Grid item>
                                                                <Typography className="!text-sm !font-bold">Overall QB Rating</Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <CustomLinearProgress
                                                                    value={player.metrics.stats?.metrics?.overall_score || 0}
                                                                    color="#00FF00"
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item container gap={1} justifyContent={'space-evenly'}>
                                                        <Grid item flexDirection={'column'} xs>
                                                            <button onClick={() => window.open(player.metrics.reportPdfUrl)} className={`bg-white w-full text-black text-sm px-5 py-3 rounded-lg ${!player.metrics.reportPdfUrl && 'hidden'}`}>
                                                                DOWNLOAD PDF
                                                            </button>
                                                        </Grid>
                                                        <Grid item flexDirection={'column'} xs>
                                                            <button onClick={() => setVideoSrc(player.metrics.overlayVideoUrl)} className={`bg-white w-full text-black text-sm px-5 py-3 rounded-lg ${!player.metrics.overlayVideoUrl && 'hidden'}`}>
                                                                OVERLAY VIDEO
                                                            </button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </TableCell>
                                        </TableRow>
                                    </Fragment>
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
