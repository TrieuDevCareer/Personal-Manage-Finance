import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Box, TextField, Stack, Button, MenuItem } from "@mui/material";
import LoadingProgess from "../../misc/loadingProgess.js";
import domain from "../../../util/domain.js";
import ErrorMessage from "../../misc/ErrorMessage";
import "./expenseEditor.scss";

function ExpenseEditor({ getExpenses, setExpenseEditorOpen, editExpenseData }) {
  const [exelstCode, setExelstCode] = useState("");
  const [exeLstContent, setExeLstContent] = useState("");
  const [expDate, setIncDate] = useState(null);
  const [expDetail, setIncDetail] = useState("");
  const [expMoney, setIncMoney] = useState(0);
  const [expenseListData, setExpenseListData] = useState([]);
  const [expDMoney, setExpDMoney] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  function closeEditor() {
    setExpenseEditorOpen(false);
  }

  async function saveExpense(e) {
    e.preventDefault();
    setIsLoading(true);
    const oExpenseData = {
      exelstCode,
      exeLstContent: exeLstContent.split(" - ")[1],
      expDate,
      expDetail,
      expMoney,
      expDMoney,
    };

    try {
      if (!editExpenseData) await Axios.post(`${domain}/expense/`, oExpenseData);
      else await Axios.put(`${domain}/expense/${editExpenseData._id}`, oExpenseData);
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        if (err.response.data.errorMessage) {
          setMessage(err.response.data.errorMessage);
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
  function onChangeLstExe(e) {
    const dic = e.target.value.split(" - ");
    setExelstCode(dic[0]);
    setExeLstContent(e.target.value);
  }
  async function getExpenseLists() {
    const expenseLists = await Axios.get(`${domain}/expenselist/`);
    setExpenseListData(expenseLists.data);
  }
  function onChangeMoney(e) {
    if (editExpenseData) {
      setExpDMoney(parseInt(e.target.value) - currencyStringToInt(editExpenseData.expMoney));
    }
    setIncMoney(e.target.value);
  }
  useEffect(() => {
    getExpenseLists();
    if (editExpenseData) {
      setExelstCode(editExpenseData.exelstCode ? editExpenseData.exelstCode : "");
      setExeLstContent(
        editExpenseData.exeLstContent
          ? editExpenseData.exelstCode + " - " + editExpenseData.exeLstContent
          : ""
      );
      setIncDate(editExpenseData.expDate ? editExpenseData.expDate : null);
      setIncDetail(editExpenseData.expDetail ? editExpenseData.expDetail : "");
      setIncMoney(editExpenseData.expMoney ? currencyStringToInt(editExpenseData.expMoney) : 0);
    }
  }, [editExpenseData]);
  return (
    <div className="popup-container">
      {isLoading && <LoadingProgess />}
      {!isLoading && (
        <Box
          className="popup-form"
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "40rem" },
          }}
          noValidate
          autoComplete="off"
          onSubmit={saveExpense}
        >
          <ErrorMessage message={message} setMessage={setMessage} />
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
            value={exeLstContent}
            defaultValue="EUR"
            onChange={onChangeLstExe}
          >
            {expenseListData.map((option) => (
              <MenuItem
                key={option.exeLstContent}
                value={`${option.exelstCode} - ${option.exeLstContent}`}
              >
                {option.exelstCode} - {option.exeLstContent}
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
            value={exelstCode}
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
      )}
    </div>
  );
}
export default ExpenseEditor;
