import React, { useState, useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import "./loadingProgess.scss";

function LoadingProgess() {
  return (
    <Box className="linear-progress" sx={{ width: "100%", height: "38rem" }}>
      <LinearProgress />
    </Box>
  );
}
export default LoadingProgess;
