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
  CircularProgress
} from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import AddVideoModal from "../AddVideoModal/AddVideoModal";
import EditVideoModal from "../EditVideoModal/EditVideoModal";
import DeleteVideoModal from "../DeleteVideoModal/DeleteVideoModal";
import { useSession } from "next-auth/react";
import { useApp } from "@/components/Context/AppContext";

const DrillLibrary = () => {
  const { user } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [videos, setVideos] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedVideoData, setSelectedVideoData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCategoriesAndVideos = async () => {
    setLoading(true);
    try {
      const categoryResponse = await axios.get("/api/categories");
      const categoryData = categoryResponse.data;
      const categoryList = categoryData.map((cat) => ({
        name: cat.name,
        _id: cat._id,
      }))

      setCategories(categoryList);

      const videoResponse = await axios.get("/api/drills");
      videoResponse.data = videoResponse.data.filter((video) =>
        video.isFree
          ? true
          : ["player", "trainer"].includes(user?.role)
            ? user?.subscription?.status === "active"
              ? true
              : false
            : true
      );
      setAllVideos(videoResponse.data);
      setVideos(videoResponse.data);
    } catch (error) {
      console.error("Error fetching categories and videos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCategoriesAndVideos();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCategory === "all") {
      setVideos(allVideos);
    } else {
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
    const description = video.description ? video.description.toLowerCase() : "";

    return title.includes(searchLower) || description.includes(searchLower);
  }); 1

  return (
    <>
      <div className="flex-1">
        <div className="blueBackground p-4 primary-border rounded-lg flex items-center justify-between mb-4 h-32 w-full xl:w-3/5">
          <div className="flex gap-5 items-center">
            <div className="ml-4">
              <h2 className="text-base md:text-4xl font-normal">
                Here's your
                <span className="ml-2 text-primary font-semibold">Drill Library</span>
              </h2>
              <p className="text-white text-xs md:text-sm">
                Please choose any category below to see the desired media.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full justify-between">
            <Tabs
              value={selectedCategory}
              onChange={handleCategoryChange}
              indicatorColor="none"
              textColor="inherit"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="category tabs"
              className="w-full !blueBackground py-2.5 !px-2.5 rounded-lg"
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
              {[{ name: 'All', _id: 'all' }].concat(categories).map((category) => (
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
            <div className="flex flex-col md:flex-row justify-end gap-[30px] w-full">
              <div className="flex search-bar w-full md:w-[200px] 4xl:w-[580px] ">
                <input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full py-1 rounded-lg text-white h-12 search-background focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div className={`flex justify-center ${user?.role !== "admin" && "hidden"}`}>
                <button
                  className="bg-white dark-blue-color rounded w-44 h-14 flex items-center justify-center text-lg rounded-lg"
                  onClick={() => setShowAddModal(true)}
                >
                  ADD NEW DRILL
                </button>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center mt-12">
              <CircularProgress />
            </div>
          ) : (
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
                        height={268}
                        src={video.videoLink}
                        title={video.title}
                        className="rounded-lg"
                      />
                      <CardContent className="pl-1 pt-2">
                        <Grid container gap={1} justifyContent={'space-between'}>
                          <Grid item container flexDirection={'column'} xs={true}>
                            <Grid item>
                              <p className="text-sm md:text-base font-semibold text-white">
                                {video.title}
                              </p>
                            </Grid>
                            <Grid item >
                              <p className="text-xs md:text-sm text-white">
                                {video.description}
                              </p>
                            </Grid>
                          </Grid>
                          <Grid item container gap={2} sx={{ display: user?.role === "admin" ? "flex" : "none" }} xs={'auto'}>
                            <Grid item>
                              <button
                                onClick={() => handleEditClick(video._id)}
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
                      </CardContent>
                      <div className="absolute left-2 -top-6">
                        <YouTubeIcon className="text-red-500" />
                      </div>
                    </Card>
                  </Grid>
                ))
              ) : (
                <div className="flex justify-center items-center w-full pt-24">
                  <p className="text-white">No videos available</p>
                </div>
              )}
            </Grid>
          )}
        </div>
      </div>
      {showAddModal && (
        <AddVideoModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          categories={categories}
          initialCategory={selectedCategory}
          onSuccess={fetchCategoriesAndVideos}
        />
      )}
      {showEditModal && (
        <EditVideoModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          videoId={selectedVideoId}
          videoData={selectedVideoData}
          categories={categories}
          onSuccess={fetchCategoriesAndVideos}
        />
      )}
      {showDeleteModal && (
        <DeleteVideoModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          videoId={selectedVideoId}
          onSuccess={fetchCategoriesAndVideos}
        />
      )}
    </>
  );
};

export default DrillLibrary;
