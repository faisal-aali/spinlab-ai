"use client";
import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";

const videos = [
  {
    category: "Fundamentals",
    title: "Video Title 1",
    description: "Lorem ipsum dolor sit amet consectetur. Nunc egestas in faucibus eu posuere eget tellus eget.",
    url: "https://www.youtube.com/embed/vH_jIQS1fho?si=eaQh1kx6ZXu8rg5p",
  },
  {
    category: "Exercises",
    title: "Video Title 2",
    description: "Lorem ipsum dolor sit amet consectetur. Nunc egestas in faucibus eu posuere eget tellus eget.",
    url: "https://www.youtube.com/embed/VIDEO_ID_2",
  },
  {
    category: "Mobility",
    title: "Video Title 3",
    description: "Lorem ipsum dolor sit amet consectetur. Nunc egestas in faucibus eu posuere eget tellus eget.",
    url: "https://www.youtube.com/embed/VIDEO_ID_3",
  },
  {
    category: "Footwork",
    title: "Video Title 4",
    description: "Lorem ipsum dolor sit amet consectetur. Nunc egestas in faucibus eu posuere eget tellus eget.",
    url: "https://www.youtube.com/embed/VIDEO_ID_4",
  },
  {
    category: "Footwork",
    title: "Video Title 5",
    description: "Lorem ipsum dolor sit amet consectetur. Nunc egestas in faucibus eu posuere eget tellus eget.",
    url: "https://www.youtube.com/embed/VIDEO_ID_4",
  },
  {
    category: "Fundamentals",
    title: "Video Title 6",
    description: "Lorem ipsum dolor sit amet consectetur. Nunc egestas in faucibus eu posuere eget tellus eget.",
    url: "https://www.youtube.com/embed/VIDEO_ID_4",
  },
  {
    category: "Mobility",
    title: "Video Title 7",
    description: "Lorem ipsum dolor sit amet consectetur. Nunc egestas in faucibus eu posuere eget tellus eget.",
    url: "https://www.youtube.com/embed/VIDEO_ID_4",
  },
  {
    category: "Fundamentals",
    title: "Video Title 8",
    description: "Lorem ipsum dolor sit amet consectetur. Nunc egestas in faucibus eu posuere eget tellus eget.",
    url: "https://www.youtube.com/embed/VIDEO_ID_4",
  },
  {
    category: "Mobility",
    title: "Video Title 9",
    description: "Lorem ipsum dolor sit amet consectetur. Nunc egestas in faucibus eu posuere eget tellus eget.",
    url: "https://www.youtube.com/embed/VIDEO_ID_4",
  },
];

const categories = [
  "All",
  "Fundamentals",
  "Exercises",
  "Mobility",
  "Footwork",
  "IQ",
  "Arm Care",
  "Drills",
];

const DrillLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredVideos = videos.filter((video) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (selectedCategory === "All" || video.category === selectedCategory) &&
      (video.title.toLowerCase().includes(searchLower) ||
        video.description.toLowerCase().includes(searchLower) ||
        video.category.toLowerCase().includes(searchLower))
    );
  });

  return (
    <>
      <div className="flex-1 py-8">
        <div className="blueBackground p-4 primary-border rounded-lg flex items-center justify-between w-3/5 mb-4 h-32">
          <div className="flex gap-5 items-center">
            <div className="ml-4">
              <h2 className="font-normal">
                Here’s your 
                <span className="ml-2 text-primary font-semibold">
                  Drill Library
                </span>
              </h2>
              <p className="text-white text-sm">
                Please choose any category beslow to see the desired media.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg">
          <div className="flex items-center justify-between">
            <div className="tabs-wrapper w-1/2">
              <Tabs
                value={selectedCategory}
                onChange={handleCategoryChange}
                indicatorColor="none"
                textColor="inherit"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="category tabs"
                className="blueBackground py-2.5 rounded-lg"
                sx={{
                  backgroundColor: "#001f3f",
                  ".css-1wsiv9x-MuiButtonBase-root-MuiTab-root": {
                    minHeight: "40px",
                    backgroundColor: "#32E10026",
                    borderRadius: "6px",
                    fontWeight: 500,
                    fontSize: "15px",
                    textTransform:"capitalize",
                    padding:" 0 10px"
                  },
                  ".MuiTabs-flexContainer": {
                    justifyContent: "space-around",
                    gap: "10px",
                  },
                  ".Mui-selected": {
                    backgroundColor: "#00ff00",
                    color: "#000",
                  },
                }}
              >
                {categories.map((category) => (
                  <Tab
                    key={category}
                    label={category}
                    value={category}
                    sx={{
                      color: "#ffffff",
                      "&.Mui-selected": {
                        color: "#000000",
                      },
                    }}
                  />
                ))}
              </Tabs>
            </div>
            <div className="search-bar w-2/5">
              <input
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-2 py-1 rounded-lg text-white h-12 search-background focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video, index) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                  <Card sx={{ borderRadius: '10px', backgroundColor: 'transparent' , boxShadow: 'none'}} className="relative">
                    <CardMedia
                      component="iframe"
                      height="238"
                      src={video.url}
                      title={video.title}
                      className="rounded-lg"
                    />
                    <CardContent className="pl-1 pt-2	">
                      <Typography variant="body2" className="text-white">
                        {video.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" className="text-white watch-youtube-wrapper ">
                        Watch on
                        <YouTubeIcon className="ml-2 mr-0"
                          sx={{ verticalAlign: "middle", marginRight: "5px" }}
                        />
                         <span className="font-semibold">YouTube</span>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="h6" component="div" sx={{ margin: 2 }}>
                No videos found.
              </Typography>
            )}
          </Grid>
        </div>
      </div>
    </>
  );
};

export default DrillLibrary;
