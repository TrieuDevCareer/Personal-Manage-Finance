import React from "react";

import { Alert } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";
import "./ErrorMessage.scss";
function ErrorMessage({ message, setMessage }) {
  return (
    <Collapse in={message}>
      <Alert
        className="error-message"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setMessage("");
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 1 }}
        severity="error"
      >
        {message}
      </Alert>
    </Collapse>
  );
}

export default ErrorMessage;
