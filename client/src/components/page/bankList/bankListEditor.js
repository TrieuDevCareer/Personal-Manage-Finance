import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Box, TextField, Stack, Button, MenuItem } from "@mui/material";
import domain from "../../../util/domain.js";
import "./bankListEditor.scss";

function BankListEditor({ getBankLists, setBankListEditorOpen, editBankListData }) {
  const [bnkLstID, setBnkLstID] = useState("");
  const [bnkName, setBnkName] = useState("");
  function closeEditor() {
    setBankListEditorOpen(false);
  }

  async function saveInCome(e) {
    e.preventDefault();
    const oBankListData = {
      bnkLstID,
      bnkName,
    };

    try {
      if (!editBankListData) await Axios.post(`${domain}/banklist/`, oBankListData);
      else await Axios.put(`${domain}/banklist/${editBankListData._id}`, oBankListData);
    } catch (err) {
      if (err.response) {
        if (err.response.data.errorMessage) {
          console.log(err.response.data);
        }
      }
      return;
    }

    getBankLists();
    closeEditor();
  }
  useEffect(() => {
    if (editBankListData) {
      setBnkLstID(editBankListData.bnkLstID ? editBankListData.bnkLstID : "");
      setBnkName(editBankListData.bnkName ? editBankListData.bnkName : "");
    }
  }, [editBankListData]);
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
        <TextField
          className="popup-text"
          fullWidth
          label="Mã ngân hàng"
          id="fullWidth"
          type="input"
          value={bnkLstID}
          onChange={(e) => setBnkLstID(e.target.value)}
        />
        <TextField
          className="popup-text"
          fullWidth
          label="Tên ngân hàng"
          id="fullWidth"
          type="input"
          value={bnkName}
          onChange={(e) => setBnkName(e.target.value)}
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
export default BankListEditor;
