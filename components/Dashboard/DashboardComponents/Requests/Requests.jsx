"use client";
import React, { useState } from "react";
import {
  Button,
  Paper,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useApp } from "@/components/Context/AppContext";
import PlayerVideoDetailsModal from "./modal/PlayerVideoDetailsModal";


const messagesData = [
  {
    id: 1,
    name: "James Anderson",
    email: "faisalali.ux@gmail.com",
    details:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. ",
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarahsmith@example.com",
    details:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. ",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michaeljohnson@example.com",
    details:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. .",
  },
];

const Requests = () => {
  const [selectedMessage, setSelectedMessage] = useState(messagesData[0] || null);
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useApp();

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
  };

  const handleShowDetails = () => {
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const playerDetails = {
    name: "Micheal Phillips",
    location: "Dallas, Texas",
    armSpeed: 7.6,
    releaseTime: 458,
    qbRating: 100,
    kinematicSequence: 100,
    acceleration: 100,
    deceleration: 100,
    velocityEfficiency: 100,
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="blueBackground p-4 primary-border rounded-lg flex items-center justify-between mb-4 h-32 w-full xl:mt-0 xl:w-3/5">
          <div className="flex gap-5 items-center">
            <div className="ml-4">
              <h2 className="text-2xl md:text-4xl font-normal">
                Hello{" "}
                <span className="font-semibold capitalize">
                  {user?.name.split(" ")[0]}
                </span>
              </h2>
            </div>
          </div>
        </div>
        <div className="flex flex-grow gap-4 request-wrapper">
          <Paper className="w-2/5 flex-grow !bg-transparent p-4 requested-users">
            <Typography variant="h3" className="text-white ">
              Messages
            </Typography>
            <List className="!mt-6 !bg-slate-900 !pt-0">
              {messagesData.map((message) => (
                <ListItemButton
                className="h-[75px]"
                  key={message.id}
                  onClick={() => handleMessageClick(message)}
                >
                  <ListItemText
                    primary={
                      <span className="flex">
                        <span className="w-1/3">{message.name}</span>
                        <span className="text-gray-400 w-1/5">{message.email}</span>
                      </span>
                    }
                    className="text-white"
                  />
                  {selectedMessage?.id === message.id && (
                    <ChevronRightIcon className="text-white" />
                  )}
                </ListItemButton>
              ))}
            </List>
          </Paper>

          <Paper className="w-3/5 flex-none !bg-transparent p-4">
            <div className="flex items-center justify-between">
              <Typography variant="h3" className="text-white">
                Details
              </Typography>
              <button className="w-60 h-[42px] dark-blue-color bg-white border rounded-lg flex items-center justify-center text-lg"
               onClick={handleShowDetails}>
                SEE VIDEO & DETAILS
              </button>
            </div>
            {selectedMessage ? (
              <div className="mt-6 text-gray-300">
                <textarea
                  value={selectedMessage.details}
                  readOnly
                  className="w-full h-[240px] bg-transparent text-white opacity-45 border rounded-lg p-4 focus:outline-none resize-none"
                  style={{ height: '200px' }}
                />
                <div className="mt-4 flex justify-center gap-4">
                  <button className="w-72 h-[44px] text-white border rounded flex items-center justify-center text-lg font-bold">
                    Reject Delete Request
                  </button>
                  <button className="w-72 h-[44px] bg-primary dark-blue-color rounded flex items-center justify-center text-lg font-bold">
                    Accept Delete Request
                  </button>
                </div>
              </div>
            ) : (
              <Typography variant="body2" className="text-gray-500">
                Select a message to see details
              </Typography>
            )}
          </Paper>
        </div>
      </div>

      <PlayerVideoDetailsModal
        open={showDetails}
        onClose={handleCloseDetails}
        player={playerDetails}
      />
    </div>
  );
};

export default Requests;
