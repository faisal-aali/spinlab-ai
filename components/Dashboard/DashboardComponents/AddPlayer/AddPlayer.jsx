"use client";
import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Add } from "@mui/icons-material";
import { green } from "@mui/material/colors";
import AddNewPlayerModal from "../AddNewPlayerModal/AddNewPlayerModal";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { convertCmToFeetAndInches } from "@/util/utils";
import { useSession } from "next-auth/react";
import UploadModal from "../UploadVideoModal/UploadModal";

const PlayerCard = ({ player, playersMetrics, setShowUploadModal, setSelectedPlayerId }) => {
  const router = useRouter()

  return (
    <Card className="bg-transparent p-1 border primary-border">
      <Grid container flexDirection={{ xs: 'column', sm: 'row' }} padding={1} gap={2}>
        <Grid item display={'flex'} justifyContent={'center'}>
          <CardMedia component={'img'} style={{ width: 140, height: 165, borderRadius: '8px', objectFit: 'cover', objectPosition: '50% 10%' }} image={player.avatarUrl || '/assets/player.png'} />
        </Grid>
        <Grid item alignItems={'center'} justifyContent={{ xs: 'center' }} display={'flex'} xs>
          <CardContent style={{ padding: 0 }}>
            <Grid container flexDirection={'column'} display={'flex'} alignItems={{ xs: 'center', sm: 'start' }} gap={2}>
              <Grid item>
                <Typography className="!text-white !text-2xl">{player.name}</Typography>
              </Grid>
              <Grid item container gap={2}>
                <Grid item className="blueBackground w-32 md:w-36	text-center py-2 px-4 md:px-8 primary-border-green rounded">
                  <Typography className="text-white text-lg	">{convertCmToFeetAndInches(player.roleData.height).string}</Typography>
                </Grid>
                <Grid item className="blueBackground w-32 md:w-36	text-center py-2 px-4 md:px-8 primary-border-green rounded">
                  <Typography className="text-white text-lg	">{player.roleData.weight} lbs</Typography>
                </Grid>
              </Grid>
              <Grid item container gap={2} justifyContent={'space-between'}>
                <Grid item display={playersMetrics ? 'none' : 'block'}>
                  <button onClick={() => {
                    setSelectedPlayerId(player._id)
                    setShowUploadModal(true)
                  }} className="bg-white dark-blue-color font-bold rounded w-28 md:w-32 h-9  flex items-center justify-center text-base">
                    UPLOAD
                  </button>
                </Grid>
                <Grid item xs>
                  <button onClick={() => router.push(`/metrics?playerId=${player._id}`)} style={{ width: playersMetrics && '100%' }} className="bg-primary text-black rounded w-36 md:w-40 h-9 flex items-center justify-center text-base hover-button-shadow">
                    VIEW METRICS
                  </button>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

const AddPlayer = () => {
  const userSession = useSession().data?.user || {}
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname()
  const [players, setPlayers] = useState()
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedPlayerId, setSelectedPlayerId] = useState('')

  const playersMetrics = (pathname == '/players-metrics')

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = () => {
    axios.get('/api/users', { params: { role: 'player', trainerId: userSession._id } }).then(res => {
      setPlayers(res.data)
    }).catch(console.error)
  }

  // const handleCategoryChange = (event, newValue) => {
  //   setSelectedCategory(newValue);
  // };

  // const handleSearchChange = (event) => {
  //   setSearchQuery(event.target.value);
  // };

  const filteredPlayers = players?.filter((player) => player.name.toLowerCase().match(searchQuery.toLowerCase()));

  return (
    <div className="grid gap-4 py-8 ">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div>
          <h3>{playersMetrics ? 'Players Metrics' : 'Added Players'}</h3>
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
      <div>
        {!players ? <CircularProgress /> :
          <Grid container gap={2}>
            {filteredPlayers.map(player => (
              <Grid item key={player.id} width={{ xs: '100%', sm: 'auto' }}>
                <PlayerCard setSelectedPlayerId={setSelectedPlayerId} setShowUploadModal={setShowUploadModal} player={player} playersMetrics={playersMetrics} />
              </Grid>
            ))}
            <Grid item onClick={() => setShowModal(true)} className="border primary-border rounded" alignItems={'center'} justifyContent={'center'} display={playersMetrics ? 'none' : 'flex'} sx={{ ':hover': { bgcolor: green[900], cursor: 'pointer' } }} minHeight={175} width={{ xs: '100%', sm: 485 }}>
              <IconButton>
                <Add className="text-primary" fontSize="large" />
              </IconButton>
            </Grid>
          </Grid>}
      </div>
      {showModal && <AddNewPlayerModal onClose={() => setShowModal(false)} open={showModal} onSuccess={fetchPlayers} />}
      <UploadModal playerId={selectedPlayerId} open={showUploadModal} onClose={() => setShowUploadModal(false)} onSuccess={() => setShowUploadModal(false)} type={'upload'} />
    </div>
  );
};

export default AddPlayer;
