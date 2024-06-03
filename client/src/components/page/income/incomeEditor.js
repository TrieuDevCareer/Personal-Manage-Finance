import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Box, TextField, Stack, Button, MenuItem } from "@mui/material";
import LoadingProgess from "../../misc/loadingProgess.js";
import domain from "../../../util/domain.js";
import ErrorMessage from "../../misc/ErrorMessage";
import "./incomeEditer.scss";

function IncomeEditor({ getIncomes, setIncomeEditorOpen, editIncomeData }) {
  const [inlstCode, setInlstCode] = useState("");
  const [inLstContent, setInLstContent] = useState("");
  const [incDate, setIncDate] = useState(null);
  const [incDetail, setIncDetail] = useState("");
  const [incMoney, setIncMoney] = useState(0);
  const [incomeListData, setIncomeListData] = useState([]);
  const [incDMoney, setIncDMoney] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLockContent, setIsLockContent] = useState(true);
  const lstCodeData = ["Nguồn sống", "Tự do", "Tiết kiệm", "Đầu tư"];
  const [isPhoneWidth, setIsPhoneWidth] = useState(false);
  function closeEditor() {
    setIncomeEditorOpen(false);
  }

  async function saveInCome(e) {
    e.preventDefault();
    setIsLoading(true);
    const oIncomeData = {
      inlstCode,
      inLstContent,
      incDate,
      incDetail,
      incMoney,
      incDMoney,
    };

    try {
      if (!editIncomeData) await Axios.post(`${domain}/income/`, oIncomeData);
      else await Axios.put(`${domain}/income/${editIncomeData._id}`, oIncomeData);
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        if (err.response.data.errorMessage) {
          setMessage(err.response.data.errorMessage);
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
  function onChangeLstCode(e) {
    setInlstCode(e.target.value);

    getIncomeLists(e.target.value);
  }
  async function getIncomeLists(data) {
    const incomeLists = await Axios.post(`${domain}/incomelist/content`, { data: [data] });
    setIncomeListData(incomeLists.data);
    setIsLockContent(false);
  }
  function onChangeMoney(e) {
    if (editIncomeData) {
      setIncDMoney(parseInt(e.target.value) - currencyStringToInt(editIncomeData.incMoney));
    }
    setIncMoney(e.target.value);
  }
  useEffect(() => {
    if (editIncomeData) {
      setInlstCode(editIncomeData.inlstCode ? editIncomeData.inlstCode : "");
      setInLstContent(editIncomeData.inLstContent ? editIncomeData.inLstContent : "");
      setIncDate(editIncomeData.incDate ? editIncomeData.incDate : null);
      setIncDetail(editIncomeData.incDetail ? editIncomeData.incDetail : "");
      setIncMoney(editIncomeData.incMoney ? currencyStringToInt(editIncomeData.incMoney) : 0);
      setIsLockContent(false);
      getIncomeLists(editIncomeData.inlstCode);
    }
    if (window.outerWidth <= 375) {
      setIsPhoneWidth(true);
    }
  }, [editIncomeData]);

  return (
    <div className="popup-container-income">
      {isLoading && <LoadingProgess />}
      {!isLoading && (
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
            fullWidth
            select
            label="Nguồn quỹ"
            id="fullWidth"
            type="input"
            value={inlstCode}
            onChange={onChangeLstCode}
          >
            {lstCodeData.map((option) => (
              <MenuItem
                key={option}
                value={
                  option === "Nguồn sống"
                    ? "SO"
                    : option === "Tự do"
                    ? "TD"
                    : option === "Tiết kiệm"
                    ? "TK"
                    : "DT"
                }
              >
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            disabled={isLockContent}
            className="popup-text"
            id="outlined-select-currency"
            fullWidth
            select
            label="Danh mục thu nhập"
            value={inLstContent}
            onChange={(e) => setInLstContent(e.target.value)}
          >
            {incomeListData.map((option) => (
              <MenuItem key={option.inLstContent} value={`${option.inLstContent}`}>
                {option.inLstContent}
              </MenuItem>
            ))}
          </TextField>
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
          <Stack spacing={1} direction="row" justifyContent="right">
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
export default IncomeEditor;
