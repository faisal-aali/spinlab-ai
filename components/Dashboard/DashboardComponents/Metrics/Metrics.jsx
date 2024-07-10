'use client'

import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material"


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
                        <Typography className="text-white text-2xl">{player.height}</Typography>
                    </Grid>
                    <Grid item className="blueBackground py-1 px-8 primary-border rounded" height={'100%'}>
                        <Typography className="text-white text-2xl">{player.weight}</Typography>
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

const KPICard = ({ icon, text, value, precentage }) => {

    return (
        <Grid container>

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

    return (
        <div className="flex">
            <div className="flex-1">
                <PlayerCard player={player} />
            </div>
        </div>
    )
}