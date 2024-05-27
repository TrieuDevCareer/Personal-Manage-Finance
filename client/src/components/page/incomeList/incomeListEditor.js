import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Box, TextField, Stack, Button, MenuItem } from "@mui/material";
import LoadingProgess from "../../misc/loadingProgess.js";
import domain from "../../../util/domain.js";
import ErrorMessage from "../../misc/ErrorMessage";
import "./incomeListEditor.scss";

const optionSource = [
  {
    value: "SO",
    label: "Nguồn sống",
  },
  {
    value: "TK",
    label: "Tiết kiệm",
  },
  {
    value: "DT",
    label: "Đầu tư",
  },
  {
    value: "TD",
    label: "Tự do",
  },
];

function IncomeListEditor({ getIncomeLists, setIncomeListEditorOpen, editIncomeListData }) {
  const [inlstCode, setInlstCode] = useState("");
  const [inLstContent, setInLstContent] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  function closeEditor() {
    setIncomeListEditorOpen(false);
  }

  async function saveInCome(e) {
    e.preventDefault();
    setIsLoading(true);
    const oIncomeListData = {
      inlstCode,
      inLstContent,
    };

    try {
      if (!editIncomeListData) await Axios.post(`${domain}/incomelist/`, oIncomeListData);
      else await Axios.put(`${domain}/incomelist/${editIncomeListData._id}`, oIncomeListData);
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        if (err.response.data.errorMessage) {
          setMessage(err.response.data.errorMessage);
        }
      }
      return;
    }

    getIncomeLists();
    closeEditor();
  }
  useEffect(() => {
    if (editIncomeListData) {
      setInlstCode(editIncomeListData.inlstCode ? editIncomeListData.inlstCode : "");
      setInLstContent(editIncomeListData.inLstContent ? editIncomeListData.inLstContent : "");
    }
  }, [editIncomeListData]);
  return (
    <>
      {isLoading && <LoadingProgess />}
      {!isLoading && (
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
              id="outlined-select-currency"
              fullWidth
              select
              label="Nguồn quỹ"
              value={inlstCode}
              onChange={(e) => setInlstCode(e.target.value)}
            >
              {optionSource.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              className="popup-text"
              fullWidth
              label="Nội dung thu nhập"
              id="fullWidth"
              type="input"
              value={inLstContent}
              onChange={(e) => setInLstContent(e.target.value)}
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
export default IncomeListEditor;
