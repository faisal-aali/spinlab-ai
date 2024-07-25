// src/components/History/History.js
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
  LinearProgress,
} from "@mui/material";

const data = Array.from({ length: 6 }).map((_, index) => ({
  id: index + 1,
  name: "Delivery on Apr 23, 2024",
  thumbnail: "https://via.placeholder.com/150.png",
  date: "Mar 29, 2024",
  overallQBRating: 86,
}));

const CustomLinearProgress = ({ value, color }) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="body2">
        {`${Math.round(value)}%`}
      </Typography>
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
    </Box>
  );
};

const History = (props) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedData = data.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <>
      <div className="flex-1">
        <div className={`blueBackground p-4 primary-border rounded-lg flex items-center justify-between mb-4 h-32 w-full xl:w-3/5 ${props.omitHeader && 'hidden'}`}>
          <div className="flex gap-5 items-center">
            <div className="ml-4">
              <h2 className="font-normal">
                Here’s your
                <span className="ml-2 text-primary font-semibold">History</span>
              </h2>
              <p className="text-white text-sm">
                You can view and download the report
              </p>
            </div>
          </div>
        </div>
        <div className="">
          <TableContainer component={Paper} className="!bg-transparent">
            <Table>
              <TableHead className="leaderboard-table-head bg-primary-light uppercase">
                <TableRow>
                  <TableCell className="!text-white">Videos</TableCell>
                  <TableCell className="!text-white">Date</TableCell>
                  <TableCell className="!text-white">Overall QB Rating</TableCell>
                  <TableCell className="!text-white">Reports</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="leaderboard-table-body">
                {paginatedData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="!text-white">
                      <img
                        src={row.thumbnail}
                        alt={row.name}
                        style={{ width: 50, height: 50 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="!text-white">
                        {row.name}
                      </Typography>
                      <Typography variant="caption" className="!text-white">
                        {row.date}
                      </Typography>
                    </TableCell>
                    <TableCell className="!text-white">
                      <CustomLinearProgress
                        value={row.overallQBRating}
                        color="#00FF00"
                      />
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="grid grid-cols-2 items-center gap-4">
                        <button className="bg-white text-black px-5 py-3 rounded-lg">
                          DOWNLOAD PDF
                        </button>
                        <button className="bg-white text-black px-5 py-3 rounded-lg">
                          VIEW HERE
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default History;
