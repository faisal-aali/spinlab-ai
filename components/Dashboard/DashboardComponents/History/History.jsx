// src/components/History/History.js
"use client";
import React, { Fragment, useEffect, useState } from "react";
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
  CircularProgress,
  IconButton,
  Grid
} from "@mui/material";
import { useSession } from "next-auth/react";
import axios from 'axios';
import Pagination from "../../../Common/Pagination/Pagination";
import VideoPlayer from "../../../Common/VideoPlayer/VideoPlayer";
import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { ExpandLess, ExpandMore } from "@mui/icons-material";

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

  const [showDetails, setShowDetails] = useState()

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
              <h2 className="text-lg md:text-4xl font-normal">
                Here's your <span className="text-primary font-semibold">History</span>
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
                      <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }} className="!text-white">Date</TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }} className="!text-white">Status</TableCell>
                      <TableCell className="!text-white">Overall QB Rating</TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }} className="!text-white">Reports</TableCell>
                      <TableCell className="!text-white" sx={{ display: { xs: 'table-cell', sm: 'table-cell', md: 'none' } }}>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="leaderboard-table-body">
                    {paginatedData.map((row, index) => {
                      const qbRating = row.assessmentDetails?.stats?.metrics?.overall_score
                      const fileUrl = row.assessmentDetails?.fileUrl
                      const pdfUrl = row.assessmentDetails?.reportPdfUrl
                      const overlayVideoUrl = row.assessmentDetails?.overlayVideoUrl

                      return (
                        <Fragment key={index}>
                          <TableRow>
                            <TableCell className="!text-white min-w-28 md:min-w-40">
                              <button onClick={() => setVideoSrc(fileUrl)} className="relative">
                                <img
                                  src={row.thumbnailUrl}
                                  alt={row.name}
                                  style={{ width: 75, height: 50, objectFit: 'cover', borderRadius: 8 }}
                                />
                                <div className="top-0 left-0 w-full h-full absolute flex justify-center items-center">
                                  <img
                                    src={'/assets/play.svg'}
                                    alt={row.name}
                                    style={{ width: 20, height: 20, objectFit: 'cover', borderRadius: 8 }}
                                  />
                                </div>
                              </button>
                            </TableCell>
                            <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>
                              {/* <Typography variant="body2" className="!text-white">
                              Delivery in
                            </Typography> */}
                              <Typography variant="caption" className="!text-white">
                                {new Date(row.creationDate).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }} className="!text-white">
                              {row.assessmentDetails?.statusText || 'Pending'}
                            </TableCell>
                            <TableCell className="!text-white min-w-40 md:min-w-60 ">
                              {qbRating &&
                                <CustomLinearProgress
                                  value={qbRating}
                                  color="#00FF00"
                                />}
                            </TableCell>
                            <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }} className="text-white min-w-96">
                              <div className="grid grid-cols-2 md:grid-cols-2 items-center gap-4">
                                <button onClick={() => window.open(pdfUrl)} className={`bg-white flex justify-center items-center gap-2 text-black px-0 md:px-5 py-2 md:py-3 rounded-lg ${!pdfUrl && 'hidden'}`}>
                                  <DownloadIcon />
                                  DOWNLOAD PDF
                                </button>
                                <button onClick={() => setVideoSrc(overlayVideoUrl)} className={`bg-white flex justify-center items-center gap-2 text-black px-0 md:px-5 py-2 md:py-3 rounded-lg ${!overlayVideoUrl && 'hidden'}`}>
                                  <PlayArrowIcon />
                                  OVERLAY VIDEO
                                </button>
                              </div>
                            </TableCell>
                            <TableCell sx={{ display: { xs: 'table-cell', sm: 'table-cell', md: 'none' } }} className="!text-white">
                              <IconButton onClick={() => setShowDetails(v => v === index ? null : index)}>
                                {index === showDetails ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
                              </IconButton>
                            </TableCell>
                          </TableRow>
                          <TableRow sx={{ display: showDetails === index ? { xs: 'table-row', sm: 'table-row', md: 'none' } : 'none' }}>
                            <TableCell colSpan={3} sx={{ padding: 0 }}>
                              <Grid container gap={2} padding={2} className="blueBackground" justifyContent={'space-between'} flexDirection={'column'}>
                                <Grid item container gap={1} justifyContent={'space-evenly'}>
                                  <Grid item container flexDirection={'column'} xs>
                                    <Grid item>
                                      <Typography className="!text-sm !font-bold">Date</Typography>
                                    </Grid>
                                    <Grid item>
                                      <Typography className="!text-sm">{new Date(row.creationDate).toLocaleDateString()}</Typography>
                                    </Grid>
                                  </Grid>
                                  <Grid item container flexDirection={'column'} xs>
                                    <Grid item>
                                      <Typography className="!text-sm !font-bold">Status</Typography>
                                    </Grid>
                                    <Grid item>
                                      <Typography className="!text-sm">{row.assessmentDetails?.statusText || 'Pending'}</Typography>
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid item container gap={1} justifyContent={'space-evenly'}>
                                  <Grid item flexDirection={'column'} xs>
                                    <button onClick={() => window.open(pdfUrl)} className={`bg-white w-full flex justify-center items-center gap-2 text-black !text-xs px-0 md:px-5 py-2 md:py-3 rounded-lg ${!pdfUrl && 'hidden'}`}>
                                      <DownloadIcon />
                                      DOWNLOAD PDF
                                    </button>
                                  </Grid>
                                  <Grid item flexDirection={'column'} xs>
                                    <button onClick={() => setVideoSrc(overlayVideoUrl)} className={`bg-white w-full flex justify-center items-center gap-2 text-black !text-xs px-0 md:px-5 py-2 md:py-3 rounded-lg ${!overlayVideoUrl && 'hidden'}`}>
                                      <PlayArrowIcon />
                                      OVERLAY VIDEO
                                    </button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </TableCell>
                          </TableRow>
                        </Fragment>
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
      </div >
    </>
  );
};

export default History;
