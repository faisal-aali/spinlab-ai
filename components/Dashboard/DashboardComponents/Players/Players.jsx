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
import Pagination from '../../../Common/Pagination/Pagination'

const data = Array.from({ length: 6 }).map((_, index) => ({
  id: index + 1,
  firstName: 'James',
  lastName: 'Anderson',
  email: 'faisalali.ux@gmail.com',
  imageUrl: "/assets/player.png",
  date: "04/29/2024",
  balance: 60,
  plan: 'Monthly'
}));

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

const Players = () => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedData = data.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <>
      <div className="flex flex-col py-8 gap-8">
        <div>
          <h6 className="text-4xl">Players Database</h6>
        </div>
        <div className="">
          <TableContainer component={Paper} className="bg-transparent">
            <Table>
              <TableHead className="leaderboard-table-head bg-primary-light uppercase">
                <TableRow>
                  <TableCell className="text-white"></TableCell>
                  <TableCell className="text-white">Name</TableCell>
                  <TableCell className="text-white">Email</TableCell>
                  <TableCell className="text-white">Date of Joining</TableCell>
                  <TableCell className="text-white">Remaining Credits</TableCell>
                  <TableCell className="text-white">Subscription Plan</TableCell>
                  <TableCell className="text-white">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="leaderboard-table-body">
                {paginatedData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-white">
                      <img
                        src={row.imageUrl}
                        alt={row.firstName}
                        style={{ width: 54, height: 64 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="text-white text-lg font-bold">
                        {row.firstName} {row.lastName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="text-white text-lg">
                        {row.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="text-white text-lg">
                        {row.date}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="text-primary text-xl">
                        {row.balance}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="text-primary text-xl">
                        {row.plan}
                      </Typography>
                    </TableCell>
                    <TableCell className="text-white">
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

export default Players;
