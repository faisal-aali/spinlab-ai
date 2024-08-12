// src/components/History/History.js
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
  LinearProgress,
  CircularProgress
} from "@mui/material";
import { useSession } from "next-auth/react";
import axios from 'axios';
import Pagination from "../../../Common/Pagination/Pagination";
import VideoPlayer from "../../../Common/VideoPlayer/VideoPlayer";

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
  const user = useSession().data?.user || {}

  const [videoSrc, setVideoSrc] = useState('')

  const [data, setData] = useState()
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    console.log('History mounted')
    fetchVideos()
  }, [])

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedData = data?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const fetchVideos = () => {
    console.log('fetchVideos called', props)
    axios.get('/api/videos', { params: { userId: props.playerId || user._id, trainerId: props.trainerId } }).then(res => {
      setData(res.data)
    }).catch(console.error)
  }

  return (
    <>
      <div className="flex-1">
        <div className={`blueBackground p-4 primary-border rounded-lg flex items-center justify-between mb-4 h-32 w-full xl:w-3/5 ${props.omitHeader && 'hidden'}`}>
          <div className="flex gap-5 items-center">
            <div className="ml-4">
              <h2 className="font-normal">
                Here's your
                <span className="ml-2 text-primary font-semibold">History</span>
              </h2>
              <p className="text-white text-sm">
                You can view and download the report
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col   gap-4">
          <div>
            {!data ? <CircularProgress /> :
              <TableContainer component={Paper} className="!bg-transparent">
                <Table>
                  <TableHead className="leaderboard-table-head bg-primary-light uppercase">
                    <TableRow>
                      <TableCell className="!text-white">Videos</TableCell>
                      <TableCell className="!text-white">Date</TableCell>
                      <TableCell className="!text-white">Status</TableCell>
                      <TableCell className="!text-white">Overall QB Rating</TableCell>
                      <TableCell className="!text-white">Reports</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="leaderboard-table-body">
                    {paginatedData.map((row) => {
                      const qbRating = row.assessmentDetails?.stats?.performance?.score3[0]
                      const fileUrl = row.assessmentDetails?.fileUrl
                      const pdfUrl = row.assessmentDetails?.reportPdfUrl
                      const overlayVideoUrl = row.assessmentDetails?.overlayVideoUrl

                      return (
                        <TableRow key={row.id}>
                          <TableCell className="!text-white">
                            <button onClick={() => setVideoSrc(fileUrl)} className="relative">
                              <img
                                src={row.thumbnailUrl}
                                alt={row.name}
                                style={{ width: 75, height: 50, objectFit: 'cover', borderRadius: 8 }}
                              />
                              <img
                                className="absolute top-4 left-6"
                                src={'/assets/play.svg'}
                                alt={row.name}
                                style={{ width: 20, height: 20, objectFit: 'cover', borderRadius: 8 }}
                              />
                            </button>
                          </TableCell>
                          <TableCell>
                            {/* <Typography variant="body2" className="!text-white">
                              Delivery in
                            </Typography> */}
                            <Typography variant="caption" className="!text-white">
                              {new Date(row.creationDate).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell className="!text-white">
                            {row.assessmentDetails?.statusText || 'Pending'}
                          </TableCell>
                          <TableCell className="!text-white">
                            {qbRating &&
                              <CustomLinearProgress
                                value={qbRating}
                                color="#00FF00"
                              />}
                          </TableCell>
                          <TableCell className="text-white">
                            <div className="grid grid-cols-2 items-center gap-4">
                              <button onClick={() => window.open(pdfUrl)} className={`bg-white text-black px-5 py-3 rounded-lg ${!pdfUrl && 'hidden'}`}>
                                DOWNLOAD PDF
                              </button>
                              <button onClick={() => setVideoSrc(overlayVideoUrl)} className={`bg-white text-black px-5 py-3 rounded-lg ${!overlayVideoUrl && 'hidden'}`}>
                                OVERLAY VIDEO
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>}
          </div>
          <div className="flex justify-center">
            <Pagination
              page={page}
              count={Math.ceil(data?.length / rowsPerPage)}
              onChange={handlePageChange}
            />
          </div>
        </div>
        <VideoPlayer open={videoSrc ? true : false} onClose={() => setVideoSrc('')} src={videoSrc} />
      </div>
    </>
  );
};

export default History;
