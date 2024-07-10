'use client'

import { Card, CardContent, CardMedia, Grid, LinearProgress, Typography } from "@mui/material"
import Box from "next-auth/providers/box";

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
            <Typography variant="body2" color="textSecondary">
                {`${Math.round(value)}%`}
            </Typography>
        </Box>
    );
};

const PlayerCard = ({ player, playersMetrics }) => {

    return (
        <Card className="bg-transparent p-1 border border-green-900">
            <Grid container gap={1} padding={1} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Grid item container xs='auto' gap={4} alignItems={'center'}>
                    <Grid item>
                        <img src={player.imageUrl} width={50} />
                    </Grid>
                    <Grid item>
                        <Typography className="text-white text-2xl">{player.firstName} {player.lastName}</Typography>
                    </Grid>
                    <Grid item className="blueBackground py-1 px-8 primary-border rounded" height={'100%'}>
                        <Typography className="text-white text-1xl">{player.height}</Typography>
                    </Grid>
                    <Grid item className="blueBackground py-1 px-8 primary-border rounded" height={'100%'}>
                        <Typography className="text-white text-1xl">{player.weight}</Typography>
                    </Grid>
                </Grid>
                <Grid item marginLeft={'auto'}>
                    <button className="bg-white text-black rounded w-36 h-8 flex items-center justify-center text-base">
                        UPLOAD MORE
                    </button>
                </Grid>
            </Grid>
        </Card>
    )
}

const KPICard = ({ icon, text, value, percentage }) => {

    return (
        <Grid container className="blueBackground rounded border primary-border" padding={3} gap={2} alignItems={'center'}>
            <Grid item>
                <img src={icon} />
            </Grid>
            <Grid item container xs='auto' flexDirection={'column'} >
                <Grid item>
                    <Typography>
                        {text}
                    </Typography>
                </Grid>
                <Grid item>
                    {value ? <Typography variant="h4"> {value} </Typography> :
                        percentage ? <CustomLinearProgress value={percentage} color={'red'} /> :
                            <Typography>Unsupported value</Typography>}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default function Metrics() {

    // dummy variable. need to get actual user obj from db
    const user = {
        role: 'trainer'
    }

    const player = {
        firstName: 'James',
        lastName: 'Anderson',
        height: '170 cm',
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
        icon: '/assets/metrics/sequence.svg'
    }, {
        text: 'Acceleration Score',
        percentage: 85.9,
        icon: '/assets/metrics/acceleration.svg'
    }, {
        text: 'Release Time',
        value: '1.56 sec',
        icon: '/assets/metrics/release-time.svg'
    }, {
        text: 'Deceleration Score',
        percentage: 71.5,
        icon: '/assets/metrics/deceleration.svg'
    }, {
        text: 'Velocity Efficiency Score',
        percentage: 82.7,
        icon: '/assets/metrics/efficiency.svg'
    },]

    return (
        <div className="flex flex-col gap-4">
            <div>
                <PlayerCard player={player} />
            </div>
            <div className="grid grid-cols-3 gap-4">
                {KPIs.map(({ value, text, icon, percentage }) => (
                    <div>
                        <KPICard value={value} text={text} icon={icon} percentage={percentage || undefined} />
                    </div>
                ))}
            </div>
        </div>
    )
}