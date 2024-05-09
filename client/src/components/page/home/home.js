import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "./home.scss";

function Home() {
  return (
    <div className="popup-container">
      <Box
        className="popup-form"
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "40rem" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          className="popup-text"
          fullWidth
          label="Outlined secondary fullWidth"
          color="secondary"
          focused
          id="fullWidth"
        />
      </Box>
    </div>
  );
}
export default Home;
