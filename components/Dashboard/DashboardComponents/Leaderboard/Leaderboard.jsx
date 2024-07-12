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

// Sample data
const data = Array.from({ length: 100 }).map((_, index) => ({
  id: index + 1,
  name: "Michael Phillips",
  age: 20,
  location: "Dallas Texas",
  date: "04/23/2024",
  armSpeed: "78 m/s",
  releaseTime: "1.56 sec",
  kineticScore: 86,
  accelerationScore: 86,
  decelerationScore: 86,
  velocityScore: 86,
}));

const Leaderboard = () => {
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
      <div className="flex-1 py-8">
        <div className="blueBackground p-4 primary-border rounded-lg flex items-center justify-between mb-4 h-32 mt-14 w-full xl:mt-0 xl:w-3/5">
          <div className="flex gap-5 items-center">
            <div className="ml-4">
              <h2 className="font-normal">Leaderboard</h2>
              <p className="text-white text-sm">View below the Top 10 players</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg" style={{ overflow: 'auto', maxWidth: 700 }}>
          <TableContainer component={Paper} className="!bg-transparent">
            <Table>
              <TableHead className="leaderboard-table-head bg-primary-light uppercase">
                <TableRow>
                  <TableCell className="!text-white">#</TableCell>
                  <TableCell className="!text-white">Name</TableCell>
                  <TableCell className="!text-white">Date</TableCell>
                  <TableCell className="!text-white">Arm Speed</TableCell>
                  <TableCell className="!text-white">Release Time</TableCell>
                  <TableCell className="!text-white">Kinetic Sequence Score</TableCell>
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
                      <div className="text-primary text-xs">
                        {row.age} | {row.location}
                      </div>
                    </TableCell>
                    <TableCell className="!text-white">{row.date}</TableCell>
                    <TableCell className="!text-white">{row.armSpeed}</TableCell>
                    <TableCell className="!text-white">{row.releaseTime}</TableCell>
                    <TableCell className="!text-white">
                      <CustomLinearProgress value={row.kineticScore} color="#00FF00" />
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
