import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Box, TextField, Stack, Button } from "@mui/material";
import domain from "../../../util/domain.js";
import LoadingProgess from "../../misc/loadingProgess.js";
import ErrorMessage from "../../misc/ErrorMessage";
import "./coinListEditor.scss";

function CoinListEditor({ getCoinLists, setCoinListEditorOpen, editCoinListData }) {
  const [coinLstID, setCoinLstID] = useState("");
  const [coinName, setCoinName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneWidth, setIsPhoneWidth] = useState(false);
  function closeEditor() {
    setCoinListEditorOpen(false);
  }

  async function saveInCome(e) {
    e.preventDefault();
    setIsLoading(true);
    const oCoinListData = {
      coinLstID,
      coinName,
    };

    try {
      if (!editCoinListData) await Axios.post(`${domain}/coinlist/`, oCoinListData);
      else await Axios.put(`${domain}/coinlist/${editCoinListData._id}`, oCoinListData);
    } catch (err) {
      setIsLoading(false);
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
    if (window.outerWidth <= 375) {
      setIsPhoneWidth(true);
    }
  }, [editCoinListData]);
  return (
    <>
      {isLoading && <LoadingProgess />}
      {!isLoading && (
        <div className="popup-container-coin">
          {" "}
          <Box
            className="popup-form"
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: isPhoneWidth ? "20rem" : "40rem" },
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
      )}
    </>
  );
}
export default CoinListEditor;
