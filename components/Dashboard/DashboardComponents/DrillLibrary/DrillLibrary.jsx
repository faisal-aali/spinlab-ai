"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
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
import AddVideoModal from "../AddVideoModal/AddVideoModal";
import EditVideoModal from "../EditVideoModal/EditVideoModal";
import DeleteVideoModal from "../DeleteVideoModal/DeleteVideoModal";
import { useSession } from "next-auth/react";

const DrillLibrary = () => {
  const user = useSession().data?.user || {};
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [videos, setVideos] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedVideoData, setSelectedVideoData] = useState(null); // Add this state

   
  const fetchCategoriesAndVideos = async () => {
    try {
      const categoryResponse = await axios.get("/api/categories");
      const categoryData = categoryResponse.data;
      const categoryList = categoryData.map((cat) => ({
        name: cat.name,
        _id: cat._id,
      }));

      setCategories(categoryList);
      if (categoryList.length > 0) {
        setSelectedCategory(categoryList[0]._id);
      }

      const videoResponse = await axios.get("/api/drills");
      setAllVideos(videoResponse.data);
      setVideos(videoResponse.data);
    } catch (error) {
      console.error("Error fetching categories and videos", error);
    }
  };

  useEffect(() => {
    fetchCategoriesAndVideos();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const filteredVideos = allVideos.filter(
        (video) => video.categoryId === selectedCategory
      );
      setVideos(filteredVideos);
    }
  }, [selectedCategory, allVideos]);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleEditClick = (videoId) => {
    const video = allVideos.find((v) => v._id === videoId);
    setSelectedVideoId(videoId);
    setSelectedVideoData(video);
    setShowEditModal(true);
  };

  const handleDeleteClick = (videoId) => {
    setSelectedVideoId(videoId);
    setShowDeleteModal(true);
  };

  const filteredVideos = videos.filter((video) => {
    const searchLower = searchQuery.toLowerCase();
    const title = video.title ? video.title.toLowerCase() : "";
    const description = video.description
      ? video.description.toLowerCase()
      : "";

    return title.includes(searchLower) || description.includes(searchLower);
  });

  return (
    <>
      <div className="flex-1">
        <div className="blueBackground p-4 primary-border rounded-lg flex items-center justify-between mb-4 h-32 w-full xl:w-3/5">
          <div className="flex gap-5 items-center">
            <div className="ml-4">
              <h2 className="font-normal">
                Here’s your
                <span className="ml-2 text-primary font-semibold">
                  Drill Library
                </span>
              </h2>
              <p className="text-white text-sm">
                Please choose any category below to see the desired media.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg">
          <div className="flex items-center justify-between gap-8 w-full justify-between">
            <Tabs
              value={selectedCategory}
              onChange={handleCategoryChange}
              indicatorColor="none"
              textColor="inherit"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="category tabs"
              className="!blueBackground py-2.5 !px-2.5 rounded-lg"
              sx={{
                color: "white",
                ".MuiButtonBase-root.MuiTab-root": {
                  minHeight: "40px",
                  backgroundColor: "#32E10026",
                  borderRadius: "6px",
                  fontWeight: 500,
                  fontSize: "15px",
                  textTransform: "capitalize",
                  padding: "10px",
                },
                ".MuiTabs-flexContainer": {
                  justifyContent: "space-around",
                  gap: "10px",
                },
                ".MuiButtonBase-root.MuiTab-root.Mui-selected": {
                  color: "#090F21",
                  backgroundColor: "#32E100",
                },
                ".MuiButtonBase-root.MuiTabScrollButton-root": {
                  width: 20,
                },
              }}
            >
              {categories.map((category) => (
                <Tab
                  key={category._id}
                  label={category.name}
                  value={category._id}
                  sx={{
                    color: "#ffffff",
                    "&.Mui-selected": {
                      color: "#000000",
                    },
                  }}
                />
              ))}
            </Tabs>
            <div className="flex flex-row justify-end gap-[30px]">
              <div className="flex search-bar w-[200px] 4xl:w-[580px] ">
                <input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-2 py-1 rounded-lg text-white h-12 search-background focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div className={`flex ${user.role !== "admin" && "hidden"}`}>
                <button
                  className="bg-white dark-blue-color rounded w-44 h-14 flex items-center justify-center text-lg rounded-lg"
                  onClick={() => setShowAddModal(true)}
                >
                  ADD NEW DRILL
                </button>
              </div>
            </div>
          </div>
          <Grid container spacing={2} sx={{ marginTop: 2, overflow: "auto" }}>
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video, index) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                  <Card
                    sx={{
                      borderRadius: "10px",
                      backgroundColor: "transparent",
                      boxShadow: "none",
                    }}
                    className="relative"
                  >
                    <CardMedia
                      component="iframe"
                      height="238"
                      src={video.videoLink}
                      title={video.title}
                      className="rounded-lg"
                    />
                    <CardContent className="pl-1 pt-2	">
                      <Grid container gap={1}>
                        <Grid item xs>
                          <Typography variant="body2" className="text-white">
                            {video.title}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          container
                          xs="auto"
                          gap={2}
                          sx={{
                            display: user.role === "admin" ? "flex" : "none",
                          }}
                        >
                          <Grid item>
                            <button
                              onClick={() =>  handleEditClick(video._id)}
                              className="bg-white flex justify-center items-center w-8 h-8 text-green-600 rounded p-2 focus:outline-none"
                            >
                              <img src="/assets/edit-icon.svg" alt="" />
                            </button>
                          </Grid>
                          <Grid item>
                            <button
                              onClick={() => handleDeleteClick(video._id)}
                              className="button-danger flex justify-center items-center w-8 h-8 rounded p-2 focus:outline-none"
                            >
                              <img src="/assets/delete-icon-white.svg" alt="" />
                            </button>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Typography
                        variant="body2"
                        className="text-white watch-youtube-wrapper "
                      >
                        Watch on
                        <YouTubeIcon
                          className="ml-2 mr-0"
                          sx={{ verticalAlign: "middle", marginRight: "5px" }}
                        />
                        <span className="font-semibold">YouTube</span>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography
                variant="h6"
                component="div"
                sx={{ margin: 2 }}
                color={"white"}
              >
                No videos found.
              </Typography>
            )}
          </Grid>
        </div>
      </div>
      <AddVideoModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        categories={categories}
        initialCategory={selectedCategory}
      />
      <EditVideoModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        categories={categories} // Pass categories to the EditVideo
        videoId={selectedVideoId} // Replace with the actual video ID
        videoData={selectedVideoData}
      />
      <DeleteVideoModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        videoId={selectedVideoId}
        onSuccess={fetchCategoriesAndVideos}
      />
    </>
  );
};

export default DrillLibrary;
