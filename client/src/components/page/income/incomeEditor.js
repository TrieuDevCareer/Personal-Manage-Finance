import React, { useState, useEffect } from "react";
import { Box, TextField, Stack, Button, MenuItem } from "@mui/material";
import "./incomeEditer.scss";

const currencies = [
  {
    value: "USD",
    label: "$",
  },
  {
    value: "SO-Lương",
    label: "Lương",
  },
  {
    value: "BTC",
    label: "฿",
  },
  {
    value: "JPY",
    label: "¥",
  },
];

function IncomeEditor({ setIncomeEditorOpen, editIncomeData }) {
  const [dicLstCode, setDicLstCode] = useState("");
  const [dicLstContent, setDicLstContent] = useState("");
  const [incDate, setIncDate] = useState(null);
  const [incDetail, setIncDetail] = useState("");
  const [incMoney, setIncMoney] = useState(0);
  function closeEditor() {
    setIncomeEditorOpen(false);
  }

  function saveInCome(e) {
    e.preventDefault();
    console.log(typeof incMoney);
  }
  function currencyStringToInt(currencyString) {
    // Remove currency symbol and thousands separator
    var numberString = currencyString.replace(/[\.,\s€]/g, "");
    // Convert to integer
    return parseInt(numberString);
  }
  useEffect(() => {
    if (editIncomeData) {
      console.log(editIncomeData.incDate);
      setDicLstCode(editIncomeData.dicLstCode ? editIncomeData.dicLstCode : "");
      setDicLstContent(editIncomeData.dicLstContent ? editIncomeData.dicLstContent : "");
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
          value={dicLstContent}
          defaultValue="EUR"
          onChange={(e) => setDicLstContent(e.target.value)}
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          className="popup-text"
          fullWidth
          label="Nguồn quỹ"
          id="fullWidth"
          type="input"
          value={dicLstCode}
          onChange={(e) => setDicLstCode(e.target.value)}
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
          onChange={(e) => setIncMoney(e.target.value)}
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
