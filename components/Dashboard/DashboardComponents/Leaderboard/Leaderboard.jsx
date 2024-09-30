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
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Pagination from "../../../Common/Pagination/Pagination";
import { useSession } from "next-auth/react";
import axios from 'axios'
import { convertDoBToAge } from "@/util/utils";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const CustomLinearProgress = ({ value, color }) => {
  const progressStyle = {
    height: 3,
    borderRadius: 0,
    backgroundColor: "#E0E0E0",
    position: "relative",
  };

  const barStyle = {
    height: "100%",
    borderRadius: 0,
    backgroundColor: color,
    width: `${value}%`,
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="body2">{`${Math.round(value)}%`}</Typography>
      <Box sx={progressStyle}>
        <Box sx={barStyle} />
      </Box>
    </Box>
  );
};


const Leaderboard = () => {

  const userSession = useSession().data?.user || {}
  const [players, setPlayers] = useState()
  const [showDetails, setShowDetails] = useState()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    axios.get('/api/users', { params: { role: 'player', includeMetrics: 1 } }).then(res => {
      setPlayers(res.data.filter(p => p.metrics.stats ? true : false).sort((a, b) => b.metrics.stats?.metrics?.overall_score - a.metrics.stats?.metrics?.overall_score).slice(0, userSession.role === 'admin' ? undefined : 20).map((p, i) => ({ serial: i + 1, ...p })))
    }).catch(console.error)
  }

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedData = players?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );


  return (
    <div>
      <div className="flex flex-col">
        <div className="blueBackground p-4 primary-border rounded-lg flex items-center justify-between mb-4 h-32 w-full xl:mt-0 xl:w-3/5">
          <div className="flex gap-5 items-center">
            <div className="ml-4">
              <h2 className="text-2xl md:text-4xl font-normal">Leaderboard</h2>
              {userSession.role !== 'admin' && <p className="text-white text-sm">View below the Top 20 players</p>}
            </div>
          </div>
        </div>
        {!players ? <CircularProgress /> :
          <div className="rounded-lg">
            <TableContainer component={Paper} className="!bg-transparent">
              <Table>
                <TableHead className="leaderboard-table-head bg-primary-light uppercase">
                  <TableRow>
                    <TableCell className="!text-white">#</TableCell>
                    <TableCell className="!text-white">Name</TableCell>
                    <TableCell className="!text-white" sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>Overall QB Rating</TableCell>
                    <TableCell className="!text-white" sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>Arm Speed</TableCell>
                    <TableCell className="!text-white" sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>Release Time</TableCell>
                    <TableCell className="!text-white" sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>Kinematic Sequence Score</TableCell>
                    <TableCell className="!text-white" sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>Acceleration Score</TableCell>
                    <TableCell className="!text-white" sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>Deceleration Score</TableCell>
                    <TableCell className="!text-white" sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>Velocity Efficiency Score</TableCell>
                    <TableCell className="!text-white" sx={{ display: { xs: 'table-cell', sm: 'table-cell', md: 'none' } }}>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="leaderboard-table-body">
                  {paginatedData.map((row, index) => (
                    <Fragment key={index}>
                      <TableRow>
                        <TableCell className="!text-white">{row.serial}</TableCell>
                        <TableCell className="!text-white text-base">
                          {row.roleData.anonymous ? 'Anonymous' : row.name}
                          <div className={`text-primary text-xs ${row.roleData.anonymous && 'hidden'}`}>
                            {`${convertDoBToAge(row.roleData.dob) || ''} ${(row.roleData.dob && (row.city || row.country) && '|') || ''} ${`${row.city || ''}${row.city && row.country ? ',' : ''} ${row.country || ''}`.trim() || ""}`.trim()}
                          </div>
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }} className="!text-white flex-col-reverse min-w-40" >
                          <CustomLinearProgress value={row.metrics.stats.metrics.overall_score} color="#FF4500" />
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }} className="!text-white min-w-24">{row.metrics.stats.metrics.hand_speed} mph</TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }} className="!text-white min-w-28">{row.metrics.stats.metrics.release_time} msec</TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }} className="!text-white min-w-48">
                          <CustomLinearProgress value={row.metrics.stats.metrics.sequence_score} color="#00FF00" />
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }} className="!text-white min-w-40">
                          <CustomLinearProgress value={row.metrics.stats.metrics.acceleration_score} color="#00BFFF" />
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }} className="!text-white min-w-40">
                          <CustomLinearProgress value={row.metrics.stats.metrics.deceleration_score} color="#8A2BE2" />
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }} className="!text-white flex-col-reverse min-w-52">
                          <CustomLinearProgress value={row.metrics.stats.metrics.efficiency_score} color="#FF4500" />
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'table-cell', sm: 'table-cell', md: 'none' } }} className="!text-white">
                          <IconButton onClick={() => setShowDetails(v => v === index ? null : index)}>
                            {index === showDetails ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ display: showDetails === index ? { xs: 'table-row', sm: 'table-row', md: 'none' } : 'none' }}>
                        <TableCell colSpan={3} sx={{ padding: 0 }}>
                          <Grid container gap={2} padding={2} className="blueBackground" justifyContent={'space-between'}>
                            <Grid item container gap={2}>
                              <Grid item container gap={1} xs justifyContent={'space-evenly'}>
                                <Grid item container flexDirection={'column'} xs>
                                  <Grid item>
                                    <Typography className="!text-sm !font-bold">Arm Speed</Typography>
                                  </Grid>
                                  <Grid item>
                                    <Typography className="!text-sm">{row.metrics.stats.metrics.hand_speed} mph</Typography>
                                  </Grid>
                                </Grid>
                                <Grid item container flexDirection={'column'} xs>
                                  <Grid item>
                                    <Typography className="!text-sm !font-bold">Release Time</Typography>
                                  </Grid>
                                  <Grid item>
                                    <Typography className="!text-sm">{row.metrics.stats.metrics.release_time} msec</Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item container flexDirection={'column'} xs>
                                <Grid item>
                                  <Typography className="!text-sm !font-bold">Overall QB Rating</Typography>
                                </Grid>
                                <Grid item>
                                  <CustomLinearProgress value={row.metrics.stats.metrics.overall_score} color="#FF4500" />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item container gap={2}>
                              <Grid item container flexDirection={'column'} xs>
                                <Grid item>
                                  <Typography className="!text-sm !font-bold">Kinematic Sequence Score</Typography>
                                </Grid>
                                <Grid item>
                                  <CustomLinearProgress value={row.metrics.stats.metrics.sequence_score} color="#00FF00" />
                                </Grid>
                              </Grid>
                              <Grid item container flexDirection={'column'} xs>
                                <Grid item>
                                  <Typography className="!text-sm !font-bold">Acceleration Score</Typography>
                                </Grid>
                                <Grid item>
                                  <CustomLinearProgress value={row.metrics.stats.metrics.acceleration_score} color="#00BFFF" />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item container gap={2}>
                              <Grid item container flexDirection={'column'} xs>
                                <Grid item>
                                  <Typography className="!text-sm !font-bold">Deceleration Score</Typography>
                                </Grid>
                                <Grid item>
                                  <CustomLinearProgress value={row.metrics.stats.metrics.deceleration_score} color="#8A2BE2" />
                                </Grid>
                              </Grid>
                              <Grid item container flexDirection={'column'} xs>
                                <Grid item>
                                  <Typography className="!text-sm !font-bold">Velocity Efficiency Score</Typography>
                                </Grid>
                                <Grid item>
                                  <CustomLinearProgress value={row.metrics.stats.metrics.efficiency_score} color="#FF4500" />
                                </Grid>
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
      </div>
    </div >
  );
};

export default Leaderboard;
