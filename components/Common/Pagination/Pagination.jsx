import React from "react";
import { Pagination, Box } from "@mui/material";

const CustomPagination = ({ page, count, onChange }) => {
  return (
    <Box display="flex" justifyContent="center" mt={2}>
      <Pagination
        count={count}
        page={page}
        onChange={onChange}
        color="primary"
        sx={{
          ".css-1to7aaw-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected": {
            backgroundColor: "#32e100",
            borderRadius: "4px",
            color: "#000000 !important"
          },
          ".css-1to7aaw-MuiButtonBase-root-MuiPaginationItem-root": {
            color: "#89939E !important",
          },
          ".css-1to7aaw-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected:hover": {
            backgroundColor: "#32e100"
          },
          ".css-1v2lvtn-MuiPaginationItem-root": {
            color: "#32e100",
            fontSize: "20px",
            marginBottom: "7px"
          }
        }}
      />
    </Box>
  );
};

export default CustomPagination;
