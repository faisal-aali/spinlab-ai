'use client'

import { East } from "@mui/icons-material";
import { Card, CardContent, CardMedia, Grid, LinearProgress, Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, SvgIcon, CircularProgress } from "@mui/material"
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from 'axios'
import { convertCmToFeetAndInches } from "@/util/utils";
import History from "../History/History";
import UploadModal from "../UploadVideoModal/UploadModal";

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
    const [showUploadModal, setShowUploadModal] = useState(false)

    return (
        <Card className="!bg-transparent p-1 border primary-border-parrot rounded-lg">
            <Grid container gap={1} padding={1} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Grid item container xs='auto' gap={4} alignItems={'center'}>
                    <Grid item>
                        <img src={player.avatarUrl} width={50} />
                    </Grid>
                    <Grid item>
                        <Typography className="text-white text-2xl">{player.name}</Typography>
                    </Grid>
                    <Grid item className="blueBackground py-1 px-8 primary-border rounded" height={'100%'}>
                        <Typography className="text-white text-lg">{convertCmToFeetAndInches(player.roleData.height).string}</Typography>
                    </Grid>
                    <Grid item className="blueBackground py-1 px-8 primary-border rounded" height={'100%'}>
                        <Typography className="text-white text-lg">{player.roleData.weight} lbs</Typography>
                    </Grid>
                </Grid>
                <Grid item className="mr-8">
                    <button onClick={() => setShowUploadModal(true)} className="bg-white text-black rounded w-36 h-8 flex items-center justify-center text-base">
                        UPLOAD MORE
                    </button>
                </Grid>
            </Grid>
            <UploadModal playerId={player._id} open={showUploadModal} onClose={() => setShowUploadModal(false)} onSuccess={() => setShowUploadModal(false)} type={'upload'} />
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
                        !Number.isNaN(percentage) ? <CustomLinearProgress value={percentage} color={color} textSize={'text-4xl'} /> :
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

export default function Metrics(props) {
    const user = useSession().data?.user || {}
    const router = useRouter()
    const [player, setPlayer] = useState()
    const [loading, setLoading] = useState(true)

    const searchParams = useSearchParams();
    const playerId = props.playerId || searchParams.get('playerId') || (user.role === 'player' && user._id)

    useEffect(() => {
        if (!playerId) return
        axios.get('/api/users', { params: { id: playerId, includeMetrics: 1 } }).then(res => {
            setPlayer(res.data[0])
            setLoading(false)
        }).catch(console.error)
    }, [])

    const KPIs = [{
        text: 'Arm Speed',
        value: `${player?.metrics?.stats?.metrics.hand_speed || 0} m/s`,
        icon: '/assets/metrics/arm-speed.svg'
    }, {
        text: 'Kinematic Sequence Score',
        percentage: player?.metrics?.stats?.metrics.sequence_score || 0,
        icon: '/assets/metrics/sequence.svg',
        color: '#32E100'
    }, {
        text: 'Acceleration Score',
        percentage: player?.metrics?.stats?.metrics.acceleration_sequence_score || 0,
        icon: '/assets/metrics/acceleration.svg',
        color: '#00B2FF'
    }, {
        text: 'Release Time',
        value: `${(player?.metrics?.stats?.metrics.release_time || 0) / 100} sec`,
        icon: '/assets/metrics/release-time.svg',
        color: '#D9D9D9'
    }, {
        text: 'Deceleration Score',
        percentage: 0,
        icon: '/assets/metrics/deceleration.svg',
        color: '#AD00FF'
    }, {
        text: 'Velocity Efficiency Score',
        percentage: 0,
        icon: '/assets/metrics/efficiency.svg',
        color: '#F52323'
    },]

    return (
        loading ? <CircularProgress /> :
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
                    <History playerId={playerId} omitHeader={true} />
                </div>
            </div>
    )
}