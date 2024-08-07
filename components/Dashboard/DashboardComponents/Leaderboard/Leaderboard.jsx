"use client";
import React, { useState } from "react";
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
} from "@mui/material";
import Pagination from "../../../Common/Pagination/Pagination";
import { useSession } from "next-auth/react";

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

  const user = useSession().data?.user || {}

  // Sample data
  const data = Array.from({ length: 100 }).map((_, index) => ({
    id: index + 1,
    name: index % 5 == 0 ? "Anonymous" : "Michael Phillips",
    age: index % 5 == 0 ? '' : 20,
    location: index % 5 == 0 ? '' : "Dallas Texas",
    date: "04/23/2024",
    armSpeed: "78 m/s",
    releaseTime: "1.56 sec",
    kinematicScore: 86,
    accelerationScore: 86,
    decelerationScore: 86,
    velocityScore: 86,
    overallQBRating: 80 - index
  })).sort((a, b) => b.overallQBRating - a.overallQBRating).slice(0, user.role === 'admin' ? undefined : 20);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [displayedData, setDisplayedData] = useState(data.slice(0, rowsPerPage));

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    paginateData(newPage, rowsPerPage);
  };

  const paginateData = (page, rowsPerPage) => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setDisplayedData(data.slice(startIndex, endIndex));
  };


  return (
    <>
      <div className="flex flex-col">
        <div className="blueBackground p-4 primary-border rounded-lg flex items-center justify-between mb-4 h-32 w-full xl:mt-0 xl:w-3/5">
          <div className="flex gap-5 items-center">
            <div className="ml-4">
              <h2 className="font-normal">Leaderboard</h2>
              <p className="text-white text-sm">View below the Top 20 players</p>
            </div>
          </div>
        </div>
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
                {displayedData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="!text-white">{row.id}</TableCell>
                    <TableCell className="!text-white text-base">
                      {row.name}
                      <div className={`text-primary text-xs ${!row.age && !row.location ? 'hidden' : ''}`}>
                        {row.age} | {row.location}
                      </div>
                    </TableCell>
                    <TableCell className="!text-white flex-col-reverse">
                      <CustomLinearProgress value={row.overallQBRating} color="#FF4500" />
                    </TableCell>
                    <TableCell className="!text-white">{row.armSpeed}</TableCell>
                    <TableCell className="!text-white">{row.releaseTime}</TableCell>
                    <TableCell className="!text-white">
                      <CustomLinearProgress value={row.kinematicScore} color="#00FF00" />
                    </TableCell>
                    <TableCell className="!text-white">
                      <CustomLinearProgress value={row.accelerationScore} color="#00BFFF" />
                    </TableCell>
                    <TableCell className="!text-white">
                      <CustomLinearProgress value={row.decelerationScore} color="#8A2BE2" />
                    </TableCell>
                    <TableCell className="!text-white flex-col-reverse">
                      <CustomLinearProgress value={row.velocityScore} color="#FF4500" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            page={page}
            count={Math.ceil(data.length / rowsPerPage)}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
