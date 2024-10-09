import React from "react";
import { Modal, Box, Typography, Grid, IconButton, Divider } from "@mui/material"; // Import Divider
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#020716",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
  maxWidth: "700px",
  maxHeight: "90vh",
  overflowY: "auto",
  color: "white",
  outline: "none",
};

const CustomLinearProgress = ({ value, color }) => {
  const progressStyle = {
    height: 3,
    borderRadius: 0,
    backgroundColor: "#E0E0E0",
  };

  const barStyle = {
    height: "100%",
    backgroundColor: color,
    width: `${value}%`,
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="body2" sx={{ mb: 0.5 }}>{`${Math.round(value)}%`}</Typography>
      <Box sx={progressStyle}>
        <Box sx={barStyle} />
      </Box>
    </Box>
  );
};

const PlayerVideoDetailsModal = ({ open, onClose, player, fileUrl }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box>
          <IconButton
            sx={{ position: "absolute", top: 15, right: 15, color: "#fff" }}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h5" sx={{ mb: 3, paddingTop: '10px' }}>
            Details
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <button onClick={() => console.log('Play video', fileUrl)} className="relative">
            <img
              src={player?.thumbnailUrl || 'path_to_thumbnail_image_or_placeholder'}
              alt={player?.name}
              style={{ width: 91, height: 50, objectFit: 'cover', borderRadius: 8 }}
            />
            <div
              style={{
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                position: "absolute",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={'/assets/play.svg'}
                alt="Play button"
                style={{ width: 23, height: 23, objectFit: 'cover' }}
              />
            </div>
          </button>

          <Box sx={{ ml: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {player?.name || 'Micheal Phillips'}
            </Typography>
            <Typography variant="body1" sx={{ color: "#00FF00" }}>
              {player?.age || '20'} | {player?.location || 'Dallas, Texas'}
            </Typography>
          </Box>
        </Box>

        {/* Divider added here */}
        <Divider sx={{ mb: 2, backgroundColor: '#232835' }} />

        {/* Player Stats with Progress Bars */}
        <Grid container gap={2} padding={2} sx={{ backgroundColor: "#ffffff0d" }} justifyContent={'space-between'}>
          <Grid item container gap={2}>
            <Grid item container gap={1} xs justifyContent={'space-evenly'}>
              <Grid item container flexDirection={'column'} xs>
                <Typography className="!text-sm !font-bold">Arm Speed</Typography>
                <Typography className="!text-sm">{player?.armSpeed} mph</Typography>
              </Grid>
              <Grid item container flexDirection={'column'} xs>
                <Typography className="!text-sm !font-bold">Release Time</Typography>
                <Typography className="!text-sm">{player?.releaseTime} msec</Typography>
              </Grid>
            </Grid>
            <Grid item container flexDirection={'column'} xs>
              <Typography className="!text-sm !font-bold">Overall QB Rating</Typography>
              <CustomLinearProgress value={player?.qbRating} color="#FF4500" />
            </Grid>
          </Grid>
          <Grid item container gap={2}>
            <Grid item container flexDirection={'column'} xs>
              <Typography className="!text-sm !font-bold">Kinematic Sequence Score</Typography>
              <CustomLinearProgress value={player?.kinematicSequence} color="#00FF00" />
            </Grid>
            <Grid item container flexDirection={'column'} xs>
              <Typography className="!text-sm !font-bold">Acceleration Score</Typography>
              <CustomLinearProgress value={player?.acceleration} color="#00BFFF" />
            </Grid>
          </Grid>
          <Grid item container gap={2}>
            <Grid item container flexDirection={'column'} xs>
              <Typography className="!text-sm !font-bold">Deceleration Score</Typography>
              <CustomLinearProgress value={player?.deceleration} color="#8A2BE2" />
            </Grid>
            <Grid item container flexDirection={'column'} xs>
              <Typography className="!text-sm !font-bold">Velocity Efficiency Score</Typography>
              <CustomLinearProgress value={player?.velocityEfficiency} color="#FF4500" />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default PlayerVideoDetailsModal;
