import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Box, TextField, Stack, Button, MenuItem } from "@mui/material";
import domain from "../../../util/domain.js";
import "./savingEditor.scss";

const StatusSav = [
  {
    value: false,
    label: "Đang gửi",
  },
  {
    value: true,
    label: "Đã rút",
  },
];

function SavingEditor({ getSavings, setSavingEditorOpen, editSavingData }) {
  const [bnkLstID, setBnkLstID] = useState("");
  const [bnkName, setBnkName] = useState("");
  const [savDate, setSavDate] = useState(null);
  const [savMoney, setSavMoney] = useState(0);
  const [savMonth, setSavMonth] = useState(0);
  const [savInteret, setSavInteret] = useState(0);
  const [savInteretMoney, setSavInteretMoney] = useState(0);
  const [savTotalMoney, setSavTotalMoney] = useState(0);
  const [savStatus, setSavStatus] = useState(false);
  const [savTRealMoney, setSavTRealMoney] = useState(0);
  const [savRealInterMoney, setSavRealInterMoney] = useState(0);
  const [bankListData, setBankListData] = useState([]);
  function closeEditor() {
    setSavingEditorOpen(false);
  }

  async function saveInCome(e) {
    e.preventDefault();
    const oSavingData = {
      bnkLstID,
      bnkName: bnkName.split("-")[1],
      savDate,
      savMoney,
      savMonth,
      savInteret,
      savInteretMoney,
      savTotalMoney,
      savStatus,
      savTRealMoney,
      savRealInterMoney,
    };

    try {
      if (!editSavingData) await Axios.post(`${domain}/saving/`, oSavingData);
      else await Axios.put(`${domain}/saving/${editSavingData._id}`, oSavingData);
    } catch (err) {
      if (err.response) {
        if (err.response.data.errorMessage) {
          console.log(err.response.data);
        }
      }
      return;
    }

    getSavings();
    closeEditor();
  }
  function currencyStringToInt(currencyString) {
    // Remove currency symbol and thousands separator
    var numberString = currencyString.replace(/[\.,\s€]/g, "");
    // Convert to integer
    return parseInt(numberString);
  }

  function onChangeMoneySave(e) {
    setSavMoney(e.target.value);
    calcuvalueRate(e.target.value, savMonth, savInteret);
  }
  function onChangeMonthSave(e) {
    setSavMonth(e.target.value);
    calcuvalueRate(savMoney, e.target.value, savInteret);
  }
  function onChangeInteretSave(e) {
    setSavInteret(e.target.value);
    calcuvalueRate(savMoney, savMonth, e.target.value);
  }

  function calcuvalueRate(savMoney, savMonth, savInteret) {
    if (savMoney !== 0 && savMonth !== 0 && savInteret !== 0) {
      const interetMoney = (savMoney * savMonth * savInteret) / 100 / 12;

      const totalMoney = parseInt(savMoney) + interetMoney;
      setSavInteretMoney(Math.round(interetMoney));
      setSavTotalMoney(Math.round(totalMoney));
    }
  }
  function onChangeRealMoney(e) {
    setSavTRealMoney(e.target.value);
    calRelMoney(e.target.value, savMoney);
  }
  function calRelMoney(savRealInterMoney, savMoney) {
    if (savRealInterMoney !== 0 && savMoney !== 0) {
      const afterSaving = parseInt(savRealInterMoney) - savMoney;
      setSavRealInterMoney(Math.round(afterSaving));
    }
  }
  function onchangeBank(e) {
    const aBank = e.target.value.split("-");
    setBnkLstID(aBank[0]);
    setBnkName(e.target.value);
  }
  async function getBankLists() {
    const bankLists = await Axios.get(`${domain}/banklist/`);
    setBankListData(bankLists.data);
  }
  useEffect(() => {
    getBankLists();
    if (editSavingData) {
      setSavDate(editSavingData.savDate ? editSavingData.savDate : null);
      setBnkName(
        editSavingData.bnkName ? editSavingData.bnkLstID + "-" + editSavingData.bnkName : ""
      );
      setSavMoney(editSavingData.savMoney ? currencyStringToInt(editSavingData.savMoney) : 0);
      setSavMonth(editSavingData.savMonth ? editSavingData.savMonth : 0);
      setSavInteret(editSavingData.savInteret ? editSavingData.savInteret : 0);
      setSavInteretMoney(
        editSavingData.savInteretMoney ? currencyStringToInt(editSavingData.savInteretMoney) : 0
      );
      setSavTotalMoney(
        editSavingData.savTotalMoney ? currencyStringToInt(editSavingData.savTotalMoney) : 0
      );
      setSavStatus(editSavingData.savStatus ? editSavingData.savStatus : false);
      setSavTRealMoney(
        editSavingData.savTRealMoney ? currencyStringToInt(editSavingData.savTRealMoney) : 0
      );
      setSavRealInterMoney(
        editSavingData.savRealInterMoney ? currencyStringToInt(editSavingData.savRealInterMoney) : 0
      );
    }
  }, [editSavingData]);
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
        <div className="text-container">
          <div className="left-group-input">
            <TextField
              className="popup-text"
              required
              label="Ngày gửi tiết kiệm"
              id=""
              type="date"
              value={savDate}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setSavDate(e.target.value)}
            />
            <TextField
              className="popup-text"
              id="outlined-select-currency"
              select
              label="Ngân hàng gửi"
              value={bnkName}
              defaultValue=""
              onChange={onchangeBank}
            >
              {bankListData.map((option) => (
                <MenuItem key={option.value} value={`${option.bnkLstID} - ${option.bnkName}`}>
                  {option.bnkLstID} - {option.bnkName}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              className="popup-text"
              label="Số tiền gửi"
              id=""
              type="number"
              value={savMoney}
              onChange={onChangeMoneySave}
            />
            <TextField
              className="popup-text"
              label="Thời gian gửi (Tháng)"
              id=""
              type="input"
              value={savMonth}
              onChange={onChangeMonthSave}
            />
            <TextField
              className="popup-text"
              label="Lãi xuất/năm"
              id=""
              type="number"
              value={savInteret}
              onChange={onChangeInteretSave}
            />
          </div>
          <div className="right-group-input">
            {" "}
            <TextField
              disabled
              className="popup-text"
              label="Tổng tiền lãi nhận được"
              id=""
              type="number"
              value={savInteretMoney}
            />
            <TextField
              disabled
              className="popup-text"
              label="Tổng tiền nhận được"
              id=""
              type="number"
              value={savTotalMoney}
            />
            <TextField
              className="popup-text"
              id="outlined-select-currency"
              select
              label="Trạng thái tiết kiệm"
              value={savStatus}
              defaultValue=""
              onChange={(e) => setSavStatus(e.target.value)}
            >
              {StatusSav.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              className="popup-text"
              label="Số tiền thực tế khi nhận"
              id=""
              type="number"
              value={savTRealMoney}
              onChange={onChangeRealMoney}
            />
            <TextField
              disabled
              className="popup-text"
              label="Số tiền chênh lệch sau khi rút"
              id=""
              type="number"
              value={savRealInterMoney}
            />
          </div>
        </div>
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
export default SavingEditor;
