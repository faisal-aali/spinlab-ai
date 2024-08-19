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
  CircularProgress,
} from "@mui/material";
import Pagination from "../../../Common/Pagination/Pagination";
import { useSession } from "next-auth/react";
import axios from 'axios'
import { convertDoBToAge } from "@/util/utils";

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

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    axios.get('/api/users', { params: { role: 'player', includeMetrics: 1 } }).then(res => {
      setPlayers(res.data.filter(p => p.metrics.stats ? true : false).sort((a, b) => b.metrics.stats?.performance?.score3[0] - a.metrics.stats?.performance?.score3[0]).slice(0, userSession.role === 'admin' ? undefined : 20))
    }).catch(console.error)
  }

  // Sample data
  // const data = Array.from({ length: 100 }).map((_, index) => ({
  //   id: index + 1,
  //   name: index % 5 == 0 ? "Anonymous" : "Michael Phillips",
  //   age: index % 5 == 0 ? '' : 20,
  //   location: index % 5 == 0 ? '' : "Dallas Texas",
  //   date: "04/23/2024",
  //   armSpeed: "78 m/s",
  //   releaseTime: "1.56 sec",
  //   kinematicScore: 86,
  //   accelerationScore: 86,
  //   decelerationScore: 86,
  //   velocityScore: 86,
  //   overallQBRating: 80 - index
  // })).sort((a, b) => b.overallQBRating - a.overallQBRating).slice(0, userSession.role === 'admin' ? undefined : 20);

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
                    <TableCell className="!text-white">Overall QB Rating</TableCell>
                    <TableCell className="!text-white">Arm Speed</TableCell>
                    <TableCell className="!text-white">Release Time</TableCell>
                    <TableCell className="!text-white">Kinematic Sequence Score</TableCell>
                    <TableCell className="!text-white">Acceleration Score</TableCell>
                    <TableCell className="!text-white">Deceleration Score</TableCell>
                    <TableCell className="!text-white">Velocity Efficiency Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="leaderboard-table-body">
                  {paginatedData.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell className="!text-white">{index + 1}</TableCell>
                      <TableCell className="!text-white text-base">
                        {row.roleData.anonymous ? 'Anonymous' : row.name}
                        <div className={`text-primary text-xs ${row.roleData.anonymous && 'hidden'}`}>
                          {`${convertDoBToAge(row.roleData.dob) || ''} ${(row.roleData.dob && (row.city || row.country) && '|') || ''} ${`${row.city || ''}${row.city && row.country ? ',' : ''} ${row.country || ''}`.trim() || ""}`.trim()}
                        </div>
                      </TableCell>
                      <TableCell className="!text-white flex-col-reverse min-w-40">
                        <CustomLinearProgress value={row.metrics.stats.performance.score3[0]} color="#FF4500" />
                      </TableCell>
                      <TableCell className="!text-white min-w-24">{row.metrics.stats.metrics.hand_speed} m/s</TableCell>
                      <TableCell className="!text-white min-w-28">{row.metrics.stats.metrics.release_time} msec</TableCell>
                      <TableCell className="!text-white min-w-48">
                        <CustomLinearProgress value={row.metrics.stats.performance.score3[0]} color="#00FF00" />
                      </TableCell>
                      <TableCell className="!text-white min-w-40">
                        <CustomLinearProgress value={row.accelerationScore} color="#00BFFF" />
                      </TableCell>
                      <TableCell className="!text-white min-w-40">
                        <CustomLinearProgress value={row.decelerationScore} color="#8A2BE2" />
                      </TableCell>
                      <TableCell className="!text-white flex-col-reverse min-w-52">
                        <CustomLinearProgress value={row.velocityScore} color="#FF4500" />
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
      </div>
    </div>
  );
};

export default Leaderboard;
