'use client'

import { East } from "@mui/icons-material";
import { Card, CardContent, CardMedia, Grid, LinearProgress, Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, SvgIcon } from "@mui/material"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CustomLinearProgress = ({ value, color, textSize }) => {
    return (
        <Grid container gap={1} flexDirection={'column'}>
            <Grid item>
                <Typography className={`${textSize}`}>
                    {`${value.toFixed(2)}%`}
                </Typography>
            </Grid>
            <Grid item>
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
            </Grid>
        </Grid>
    );
};

const PlayerCard = ({ player }) => {

    return (
        <Card className="!bg-transparent p-1 border primary-border-parrot rounded-lg">
            <Grid container gap={1} padding={1} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Grid item container xs='auto' gap={4} alignItems={'center'}>
                    <Grid item>
                        <img src={player.imageUrl} width={50} />
                    </Grid>
                    <Grid item>
                        <Typography className="text-white text-2xl">{player.firstName} {player.lastName}</Typography>
                    </Grid>
                    <Grid item className="blueBackground py-1 px-8 primary-border rounded" height={'100%'}>
                        <Typography className="text-white text-lg">{player.height}</Typography>
                    </Grid>
                    <Grid item className="blueBackground py-1 px-8 primary-border rounded" height={'100%'}>
                        <Typography className="text-white text-lg">{player.weight}</Typography>
                    </Grid>
                </Grid>
                <Grid item className="mr-8">
                    <button className="bg-white text-black rounded w-36 h-8 flex items-center justify-center text-base">
                        UPLOAD MORE
                    </button>
                </Grid>
            </Grid>
        </Card>
    )
}

const KPICard = ({ icon, text, value, percentage, color }) => {

    return (
        <Grid container className="blueBackground rounded-lg border primary-border" padding={3} gap={2} alignItems={'center'} height={'100%'}>
            <Grid item>
                <img src={icon} width={36} />
            </Grid>
            <Grid item container flexDirection={'column'} width={260}>
                <Grid item>
                    <Typography className="text-lg">
                        {text}
                    </Typography>
                </Grid>
                <Grid item>
                    {value ? <Typography className="text-4xl"> {value} </Typography> :
                        percentage ? <CustomLinearProgress value={percentage} color={color} textSize={'text-4xl'} /> :
                            <Typography>Unsupported value</Typography>}
                </Grid>
            </Grid>
        </Grid>
    )
}

const EfficiencyGraph = () => {

    return (
        <img src="/assets/efficiency-graph.png" width={'100%'} height={507} style={{ borderRadius: '8px' }} />
    )
}

const HistoryTable = () => {
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const data = Array.from({ length: 6 }).map((_, index) => ({
        id: index + 1,
        thumbnail: "https://via.placeholder.com/150",
        date: "April 07, 2024",
        efficiency: 85.9,
        sequencing: 85.9,
        overallQBRating: 86,
        tags: 'April 07, 2024'
    }));

    const paginatedData = data.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );


    return (
        <TableContainer component={Paper} className="!bg-transparent">
            <Table>
                <TableHead className="leaderboard-table-head bg-primary-light uppercase">
                    <TableRow>
                        <TableCell className="!text-white">Videos</TableCell>
                        <TableCell className="!text-white">Date</TableCell>
                        <TableCell className="!text-white">Overall QB Rating</TableCell>
                        <TableCell className="!text-white">Tags</TableCell>
                        <TableCell className="!text-white"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className="leaderboard-table-body">
                    {paginatedData.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="!text-white">
                                <img
                                    src={row.thumbnail}
                                    alt={row.name}
                                    style={{ width: 50, height: 50 }}
                                />
                            </TableCell>
                            <TableCell>
                                <Typography variant="caption" className="!text-white">
                                    {row.date}
                                </Typography>
                            </TableCell>
                            <TableCell className="!text-white">
                                <CustomLinearProgress
                                    value={row.overallQBRating}
                                    color="#00FF00"
                                    textSize={'text-sm'}
                                />
                            </TableCell>
                            <TableCell className="!text-white">
                                <Typography variant="caption" className="text-white">
                                    {row.tags}
                                </Typography>
                            </TableCell>
                            <TableCell className="!text-white" align="right">
                                <IconButton>
                                    <East className="text-primary" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default function Metrics(props) {
    const user = useSession().data?.user || {}
    const router = useRouter()

    const player = {
        firstName: 'James',
        lastName: 'Anderson',
        height: '5ft 11in',
        weight: '200 lbs',
        imageUrl: '/assets/player.png'
    }

    const KPIs = [{
        text: 'Arm Speed',
        value: '78 m/s',
        icon: '/assets/metrics/arm-speed.svg'
    }, {
        text: 'Kinematic Sequence Score',
        percentage: 85.9,
        icon: '/assets/metrics/sequence.svg',
        color: '#32E100'
    }, {
        text: 'Acceleration Score',
        percentage: 85.9,
        icon: '/assets/metrics/acceleration.svg',
        color: '#00B2FF'
    }, {
        text: 'Release Time',
        value: '1.56 sec',
        icon: '/assets/metrics/release-time.svg',
        color: '#D9D9D9'
    }, {
        text: 'Deceleration Score',
        percentage: 71.5,
        icon: '/assets/metrics/deceleration.svg',
        color: '#AD00FF'
    }, {
        text: 'Velocity Efficiency Score',
        percentage: 82.7,
        icon: '/assets/metrics/efficiency.svg',
        color: '#F52323'
    },]

    return (
        <div className="flex flex-col gap-6 mt-14">
            {user.role === 'trainer' &&
                <div>
                    <IconButton className="!border !primary-border-parrot !rounded" onClick={() => router.replace('/players-metrics')}>
                        <img src="/assets/back-icon.svg" />
                    </IconButton>
                </div>
            }
            <div className={`${props.omitPlayerCard && 'hidden'}`}>
                <PlayerCard player={player} />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-7">
                {KPIs.map((kpi, index) => (
                    <div key={index}>
                        <KPICard {...kpi} />
                    </div>
                ))}
            </div>
            <div className="blueBackground border primary-border rounded-lg">
                <EfficiencyGraph />
            </div>
            <div>
                <HistoryTable />
            </div>
        </div>
    )
}