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

const players = [
  {
    id: 1,
    firstName: 'James',
    lastName: 'Anderson',
    height: '5ft 11in',
    weight: '200 lbs',
    imageUrl: '/assets/player.png',
  },
  {
    id: 2,
    firstName: 'Drake',
    lastName: 'Johnson',
    height: '170 cm',
    weight: '200 lbs',
    imageUrl: '/assets/player.png',
  },
];

const PlayerCard = ({ player, playersMetrics }) => {
  const router = useRouter()

  return (
    <Card className="bg-transparent p-1 border primary-border">
      <Grid container padding={1} gap={2}>
        <Grid item>
          <CardMedia component={'img'} image={'/assets/player.png'} />
        </Grid>
        <Grid item alignItems={'center'} display={'flex'} xs>
          <CardContent style={{ padding: 0 }}>
            <Grid container flexDirection={'column'} gap={2}>
              <Grid item>
                <Typography className="!text-white !text-2xl">{player.name}</Typography>
              </Grid>
              <Grid item container gap={2}>
                <Grid item className="blueBackground w-36	text-center py-2 px-8 primary-border-green rounded">
                  <Typography className="text-white text-lg	">{convertCmToFeetAndInches(player.height).string}</Typography>
                </Grid>
                <Grid item className="blueBackground w-36	text-center py-2 px-8 primary-border-green rounded">
                  <Typography className="text-white text-lg	">{player.weight || 'N/A'}</Typography>
                </Grid>
              </Grid>
              <Grid item container gap={2} justifyContent={'space-between'}>
                <Grid item display={playersMetrics ? 'none' : 'block'}>
                  <button className="bg-white dark-blue-color font-bold rounded w-32 h-9  flex items-center justify-center text-base">
                    UPLOAD
                  </button>
                </Grid>
                <Grid item xs>
                  <button onClick={() => router.replace('/metrics')} style={{ width: playersMetrics && '100%' }} className="bg-primary text-black rounded w-40 h-9 flex items-center justify-center text-base hover-button-shadow">
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
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname()
  const [players, setPlayers] = useState()

  const playersMetrics = (pathname == '/players-metrics')

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = () => {
    axios.get('/api/users', { params: { role: 'player' } }).then(res => {
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
      <div className="flex justify-between">
        <div>
          <h3>{playersMetrics ? 'Players Metrics' : 'Added Players'}</h3>
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
      <div>
        {!players ? <CircularProgress /> :
          <Grid container gap={2}>
            {filteredPlayers.map(player => (
              <Grid item key={player.id}>
                <PlayerCard player={player} playersMetrics={playersMetrics} />
              </Grid>
            ))}
            <Grid item onClick={() => setShowModal(true)} className="border primary-border rounded" alignItems={'center'} justifyContent={'center'} display={playersMetrics ? 'none' : 'flex'} sx={{ ':hover': { bgcolor: green[900], cursor: 'pointer' } }} minHeight={175} width={485}>
              <IconButton>
                <Add className="text-primary" fontSize="large" />
              </IconButton>
            </Grid>
          </Grid>}
      </div>
      <AddNewPlayerModal onClose={() => setShowModal(false)} open={showModal} onSuccess={fetchPlayers} />
    </div>
  );
};

export default AddPlayer;
