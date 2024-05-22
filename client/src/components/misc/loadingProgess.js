import React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import "./loadingProgess.scss";

function LoadingProgess() {
  return (
    <div className="progess-container">
      <Box className="linear-progress" sx={{ width: "90%", height: "38rem" }}>
        <LinearProgress />
      </Box>
    </div>
  );
}
export default LoadingProgess;
