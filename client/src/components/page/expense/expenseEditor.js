import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Box, TextField, Stack, Button, MenuItem } from "@mui/material";
import domain from "../../../util/domain.js";
import "./expenseEditor.scss";

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

function ExpenseEditor({ getExpenses, setExpenseEditorOpen, editExpenseData }) {
  const [dicLstCode, setDicLstCode] = useState("");
  const [dicLstContent, setDicLstContent] = useState("");
  const [expDate, setIncDate] = useState(null);
  const [expDetail, setIncDetail] = useState("");
  const [expMoney, setIncMoney] = useState(0);
  function closeEditor() {
    setExpenseEditorOpen(false);
  }

  async function saveInCome(e) {
    e.preventDefault();
    const oExpenseData = {
      dicLstCode,
      dicLstContent,
      expDate,
      expDetail,
      expMoney,
    };

    try {
      if (!editExpenseData) await Axios.post(`${domain}/expense/`, oExpenseData);
      else await Axios.put(`${domain}/expense/${editExpenseData._id}`, oExpenseData);
    } catch (err) {
      if (err.response) {
        if (err.response.data.errorMessage) {
          console.log(err.response.data);
        }
      }
      return;
    }

    getExpenses();
    closeEditor();
  }
  function currencyStringToInt(currencyString) {
    // Remove currency symbol and thousands separator
    var numberString = currencyString.replace(/[\.,\s€]/g, "");
    // Convert to integer
    return parseInt(numberString);
  }
  useEffect(() => {
    if (editExpenseData) {
      console.log(editExpenseData._id);
      setDicLstCode(editExpenseData.dicLstCode ? editExpenseData.dicLstCode : "");
      setDicLstContent(editExpenseData.dicLstContent ? editExpenseData.dicLstContent : "");
      setIncDate(editExpenseData.expDate ? editExpenseData.expDate : null);
      setIncDetail(editExpenseData.expDetail ? editExpenseData.expDetail : "");
      setIncMoney(editExpenseData.expMoney ? currencyStringToInt(editExpenseData.expMoney) : 0);
    }
  }, [editExpenseData]);
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
          label="Ngày thực hiện chi tiêu"
          id="fullWidth"
          type="date"
          value={expDate}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setIncDate(e.target.value)}
        />
        <TextField
          className="popup-text"
          id="outlined-select-currency"
          fullWidth
          select
          label="Danh mục chi tiêu"
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
          label="Nội dung chi tiêu"
          id="fullWidth"
          type="input"
          value={expDetail}
          onChange={(e) => setIncDetail(e.target.value)}
        />
        <TextField
          className="popup-text"
          fullWidth
          label="Số tiền chi tiêu"
          id="fullWidth"
          type="number"
          value={expMoney}
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
export default ExpenseEditor;
