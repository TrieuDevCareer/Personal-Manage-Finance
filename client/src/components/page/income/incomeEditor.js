import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import { Box, TextField, Stack, Button, MenuItem } from "@mui/material";
import domain from "../../../util/domain.js";
import "./incomeEditer.scss";

function IncomeEditor({ getIncomes, setIncomeEditorOpen, editIncomeData }) {
  const [inlstCode, setInlstCode] = useState("");
  const [inLstContent, setInLstContent] = useState("");
  const [incDate, setIncDate] = useState(null);
  const [incDetail, setIncDetail] = useState("");
  const [incMoney, setIncMoney] = useState(0);
  const [incomeListData, setIncomeListData] = useState([]);
  const [incDMoney, setIncDMoney] = useState(0);
  function closeEditor() {
    setIncomeEditorOpen(false);
  }

  async function saveInCome(e) {
    e.preventDefault();
    const oIncomeData = {
      inlstCode,
      inLstContent: inLstContent.split(" - ")[1],
      incDate,
      incDetail,
      incMoney,
      incDMoney,
    };

    try {
      if (!editIncomeData) await Axios.post(`${domain}/income/`, oIncomeData);
      else await Axios.put(`${domain}/income/${editIncomeData._id}`, oIncomeData);
    } catch (err) {
      if (err.response) {
        if (err.response.data.errorMessage) {
          console.log(err.response.data);
        }
      }
      return;
    }

    getIncomes();
    closeEditor();
  }
  function currencyStringToInt(currencyString) {
    // Remove currency symbol and thousands separator
    var numberString = currencyString.replace(/[\.,\s€]/g, "");
    // Convert to integer
    return parseInt(numberString);
  }
  function onChangeLstInc(e) {
    const dic = e.target.value.split(" - ");
    setInlstCode(dic[0]);
    setInLstContent(e.target.value);
  }
  async function getIncomeLists() {
    const incomeLists = await Axios.get(`${domain}/incomelist/`);
    setIncomeListData(incomeLists.data);
  }
  function onChangeMoney(e) {
    if (editIncomeData) {
      setIncDMoney(parseInt(e.target.value) - currencyStringToInt(editIncomeData.incMoney));
    }
    setIncMoney(e.target.value);
  }
  useEffect(() => {
    getIncomeLists();
    if (editIncomeData) {
      setInlstCode(editIncomeData.inlstCode ? editIncomeData.inlstCode : "");
      setInLstContent(
        editIncomeData.inLstContent
          ? editIncomeData.inlstCode + " - " + editIncomeData.inLstContent
          : ""
      );
      setIncDate(editIncomeData.incDate ? editIncomeData.incDate : null);
      setIncDetail(editIncomeData.incDetail ? editIncomeData.incDetail : "");
      setIncMoney(editIncomeData.incMoney ? currencyStringToInt(editIncomeData.incMoney) : 0);
    }
  }, [editIncomeData]);

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
          required
          fullWidth
          label="Ngày nhận thu nhập"
          id="fullWidth"
          type="date"
          value={incDate}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setIncDate(e.target.value)}
        />
        <TextField
          className="popup-text"
          id="outlined-select-currency"
          fullWidth
          select
          label="Danh mục thu nhập"
          value={inLstContent}
          defaultValue="EUR"
          onChange={onChangeLstInc}
        >
          {incomeListData.map((option) => (
            <MenuItem
              key={option.inLstContent}
              value={`${option.inlstCode} - ${option.inLstContent}`}
            >
              {option.inlstCode} - {option.inLstContent}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          disabled
          className="popup-text"
          fullWidth
          label="Nguồn quỹ"
          id="fullWidth"
          type="input"
          value={inlstCode}
        />
        <TextField
          className="popup-text"
          fullWidth
          label="Nội dung thu nhập"
          id="fullWidth"
          type="input"
          value={incDetail}
          onChange={(e) => setIncDetail(e.target.value)}
        />
        <TextField
          className="popup-text"
          fullWidth
          label="Số tiền thu nhập"
          id="fullWidth"
          type="number"
          value={incMoney}
          onChange={onChangeMoney}
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
export default IncomeEditor;
