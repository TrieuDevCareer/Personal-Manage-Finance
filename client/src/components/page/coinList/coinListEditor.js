import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Box, TextField, Stack, Button } from "@mui/material";
import domain from "../../../util/domain.js";
import ErrorMessage from "../../misc/ErrorMessage";
import "./coinListEditor.scss";

function CoinListEditor({ getCoinLists, setCoinListEditorOpen, editCoinListData }) {
  const [coinLstID, setCoinLstID] = useState("");
  const [coinName, setCoinName] = useState("");
  const [message, setMessage] = useState("");
  function closeEditor() {
    setCoinListEditorOpen(false);
  }

  async function saveInCome(e) {
    e.preventDefault();
    const oCoinListData = {
      coinLstID,
      coinName,
    };

    try {
      if (!editCoinListData) await Axios.post(`${domain}/coinlist/`, oCoinListData);
      else await Axios.put(`${domain}/coinlist/${editCoinListData._id}`, oCoinListData);
    } catch (err) {
      if (err.response) {
        if (err.response.data.errorMessage) {
          setMessage(err.response.data.errorMessage);
        }
      }
      return;
    }

    getCoinLists();
    closeEditor();
  }
  useEffect(() => {
    if (editCoinListData) {
      setCoinLstID(editCoinListData.coinLstID ? editCoinListData.coinLstID : "");
      setCoinName(editCoinListData.coinName ? editCoinListData.coinName : "");
    }
  }, [editCoinListData]);
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
        onSubmit={saveInCome}
      >
        <ErrorMessage message={message} setMessage={setMessage} />
        <TextField
          className="popup-text"
          fullWidth
          label="Mã đồng coin"
          id="fullWidth"
          type="input"
          value={coinLstID}
          onChange={(e) => setCoinLstID(e.target.value)}
        />
        <TextField
          className="popup-text"
          fullWidth
          label="Tên đồng coin"
          id="fullWidth"
          type="input"
          value={coinName}
          onChange={(e) => setCoinName(e.target.value)}
        />
        <Stack spacing={2} direction="row" justifyContent="right">
          <Button variant="outlined" color="success" type="submit">
            Lưu thay đổi
          </Button>
          <Button variant="outlined" color="error" onClick={() => closeEditor()}>
            Hủy thay đổi
          </Button>
        </Stack>
      </Box>
    </div>
  );
}
export default CoinListEditor;
