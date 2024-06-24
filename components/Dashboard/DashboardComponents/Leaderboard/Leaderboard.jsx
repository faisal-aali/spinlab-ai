"use client";
import React from "react";
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

// Define the custom progress bar component
const CustomLinearProgress = ({ value, color }) => {
  const progressStyle = {
    height: 8,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    position: "relative",
  };

  const barStyle = {
    height: "100%",
    borderRadius: 5,
    backgroundColor: color,
    width: `${value}%`,
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={progressStyle}>
        <Box sx={barStyle} />
      </Box>
      <Typography variant="body2" color="textSecondary">{`${Math.round(
        value
      )}%`}</Typography>
    </Box>
  );
};

// Sample data
const data = Array.from({ length: 10 }).map((_, index) => ({
  id: index + 1,
  name: "Michael Phillips",
  age: 20,
  location: "Dallas Texas",
  date: "04/23/2024",
  armSpeed: "78 m/s",
  releaseTime: "1.56 sec",
  kineticScore: 85.9,
  accelerationScore: 85.9,
  decelerationScore: 85.9,
  velocityScore: 85.9,
}));

const Leaderboard = () => {
  return (
    <div className="flex-1 p-8 bg-transparent primary-border min-h-screen">
      <TableContainer component={Paper} className="bg-gray-800">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="text-green-500">#</TableCell>
              <TableCell className="text-green-500">Name</TableCell>
              <TableCell className="text-green-500">Date</TableCell>
              <TableCell className="text-green-500">Arm Speed</TableCell>
              <TableCell className="text-green-500">Release Time</TableCell>
              <TableCell className="text-green-500">
                Kinetic Sequence Score
              </TableCell>
              <TableCell className="text-green-500">
                Acceleration Score
              </TableCell>
              <TableCell className="text-green-500">
                Deceleration Score
              </TableCell>
              <TableCell className="text-green-500">
                Velocity Efficiency Score
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-white">{row.id}</TableCell>
                <TableCell className="text-white">
                  {row.name}
                  <div className="text-sm text-green-500">
                    {row.age} | {row.location}
                  </div>
                </TableCell>
                <TableCell className="text-white">{row.date}</TableCell>
                <TableCell className="text-white">{row.armSpeed}</TableCell>
                <TableCell className="text-white">{row.releaseTime}</TableCell>
                <TableCell className="text-white">
                  {row.kineticScore}%
                  <CustomLinearProgress
                    value={row.kineticScore}
                    color="#00FF00"
                  />
                </TableCell>
                <TableCell className="text-white">
                  {row.accelerationScore}%
                  <CustomLinearProgress
                    value={row.accelerationScore}
                    color="#00BFFF"
                  />
                </TableCell>
                <TableCell className="text-white">
                  {row.decelerationScore}%
                  <CustomLinearProgress
                    value={row.decelerationScore}
                    color="#8A2BE2"
                  />
                </TableCell>
                <TableCell className="text-white">
                  {row.velocityScore}%
                  <CustomLinearProgress
                    value={row.velocityScore}
                    color="#FF4500"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Leaderboard;
