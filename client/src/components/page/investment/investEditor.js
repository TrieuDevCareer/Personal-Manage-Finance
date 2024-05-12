import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Box, TextField, Stack, Button, MenuItem } from "@mui/material";
import domain from "../../../util/domain.js";
import "./investEditor.scss";

const currencies = [
  {
    value: "BTC-Bitcoin",
    label: "Bitcoin",
  },
  {
    value: "FPT-FPT software",
    label: "FPT software",
  },
  {
    value: "VT-Viettel",
    label: "Viettel",
  },
];

const StatusSav = [
  {
    value: false,
    label: "Đang giữ",
  },
  {
    value: true,
    label: "Đã bán",
  },
];

function InvestmentEditor({ getInvestments, setInvestmentEditorOpen, editInvestmentData }) {
  const [coinLstID, setCoinLstID] = useState("");
  const [coinName, setCoinName] = useState("");
  const [investDate, setInvestDate] = useState(null);
  const [investExRate, setInvestExRate] = useState(0);
  const [investMoney, setInvestMoney] = useState(0);
  const [investNumCoin, setInvestNumCoin] = useState(0);
  const [investReUSDT, setInvestReUSDT] = useState(0);
  const [investStatus, setInvestStatus] = useState(false);
  const [investSeDate, setInvestSeDate] = useState(null);
  const [investSeMoney, setInvestSeMoney] = useState(0);
  const [investSeExRate, setInvestSeExRate] = useState(0);
  const [investSeUSDT, setInvestSeUSDT] = useState(0);
  const [investReMoney, setInvestReMoney] = useState(0);
  const [investResult, setInvestResult] = useState(0);
  const [coinList, setCoinList] = useState([]);

  function closeEditor() {
    setInvestmentEditorOpen(false);
  }

  async function saveInCome(e) {
    e.preventDefault();
    const oInvestmentData = {
      coinLstID,
      coinName: coinName.split("-")[1],
      investDate,
      investExRate,
      investMoney,
      investNumCoin,
      investReUSDT,
      investStatus,
      investSeDate,
      investSeMoney,
      investSeExRate,
      investSeUSDT,
      investReMoney,
      investResult,
    };

    try {
      if (!editInvestmentData) await Axios.post(`${domain}/investment/`, oInvestmentData);
      else await Axios.put(`${domain}/investment/${editInvestmentData._id}`, oInvestmentData);
    } catch (err) {
      if (err.response) {
        if (err.response.data.errorMessage) {
          console.log(err.response.data);
        }
      }
      return;
    }

    getInvestments();
    closeEditor();
  }
  function currencyStringToInt(currencyString) {
    let result;
    // Remove currency symbol and thousands separator
    var numberString = currencyString.replace(/[\.,\s€]/g, "");
    // result = parseInt(numberString);
    console.log(typeof result);
    if (numberString.indexOf("$") > -1) {
      numberString = numberString.split("$")[1];
      result = parseInt(numberString / 100);
    } else result = parseInt(numberString);
    // Convert to integer
    return result;
  }

  function onChangeUSD(e) {
    setInvestExRate(e.target.value);
    calCoinQuantity(e.target.value, investReUSDT);
  }
  function onChangeVND(e) {
    setInvestMoney(e.target.value);
    calUSTDReveice(e.target.value);
    // calResult(e.target.value, investReMoney);
  }
  function onchangeUSDSell(e) {
    setInvestSeExRate(e.target.value);
    calUSTDSell(investMoney, e.target.value, investNumCoin);
  }
  function onChangeCoin(e) {
    const aCoinValue = e.target.value.split("-");
    setCoinLstID(aCoinValue[0]);
    setCoinName(e.target.value);
  }
  function calUSTDReveice(investMoneys) {
    if (investMoneys !== 0) {
      let ustdRe = investMoneys / 25450;
      ustdRe = Math.round(ustdRe * 10000) / 10000;
      setInvestReUSDT(ustdRe);
      calCoinQuantity(investMoneys, investExRate, ustdRe);
    }
  }
  function calCoinQuantity(investMoneys, investExRate, investReUSDT) {
    if (investExRate !== 0 && investReUSDT !== 0) {
      let quantityCoin = investReUSDT / investExRate;
      quantityCoin = Math.round(quantityCoin * 100) / 100;
      setInvestNumCoin(quantityCoin);
      calUSTDSell(investMoneys, investSeExRate, quantityCoin);
    }
  }
  function calUSTDSell(investMoneys, investSeExRate, investNumCoin) {
    if (investSeExRate !== 0 && investNumCoin !== 0) {
      const ustdSell = investNumCoin * investSeExRate;
      const vndRe = Math.ceil(ustdSell * 25450);
      setInvestSeUSDT(ustdSell);
      setInvestReMoney(vndRe);
      calResult(investMoneys, vndRe);
    }
  }
  function calResult(investMoney, investReMoney) {
    if (investMoney !== 0 && investReMoney !== 0) {
      const resultInvest = investReMoney - investMoney;
      setInvestResult(resultInvest);
    }
  }

  async function getCoinLists() {
    const coinListData = await Axios.get(`${domain}/coinlist/`);
    setCoinList(coinListData.data);
  }

  useEffect(() => {
    getCoinLists();
    if (editInvestmentData) {
      setCoinLstID(editInvestmentData.coinLstID ? editInvestmentData.coinLstID : "");
      setCoinName(
        editInvestmentData.coinName
          ? editInvestmentData.coinLstID + "-" + editInvestmentData.coinName
          : ""
      );
      setInvestDate(editInvestmentData.investDate ? editInvestmentData.investDate : null);
      setInvestExRate(
        editInvestmentData.investExRate ? currencyStringToInt(editInvestmentData.investExRate) : 0
      );
      setInvestMoney(
        editInvestmentData.investMoney ? currencyStringToInt(editInvestmentData.investMoney) : 0
      );
      setInvestNumCoin(editInvestmentData.investNumCoin ? editInvestmentData.investNumCoin : 0);
      setInvestReUSDT(editInvestmentData.investReUSDT ? editInvestmentData.investReUSDT : 0);
      setInvestStatus(editInvestmentData.investStatus ? editInvestmentData.investStatus : false);
      setInvestSeDate(editInvestmentData.investSeDate ? editInvestmentData.investSeDate : null);
      setInvestSeMoney(editInvestmentData.investSeMoney ? editInvestmentData.investSeMoney : 0);
      setInvestSeExRate(
        editInvestmentData.investSeExRate
          ? currencyStringToInt(editInvestmentData.investSeExRate)
          : 0
      );
      setInvestSeUSDT(
        editInvestmentData.investSeUSDT ? currencyStringToInt(editInvestmentData.investSeUSDT) : 0
      );
      setInvestReMoney(
        editInvestmentData.investReMoney ? currencyStringToInt(editInvestmentData.investReMoney) : 0
      );
      setInvestResult(
        editInvestmentData.investResult ? currencyStringToInt(editInvestmentData.investResult) : 0
      );
    }
  }, [editInvestmentData]);
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
              label="Ngày bắt đầu Đầu tư"
              id=""
              type="date"
              value={investDate}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setInvestDate(e.target.value)}
            />
            <TextField
              className="popup-text"
              id="outlined-select-currency"
              select
              label="Mã Coin mua"
              value={coinName}
              onChange={onChangeCoin}
            >
              {coinList.map((option) => (
                <MenuItem key={option.value} value={`${option.coinLstID} - ${option.coinName}`}>
                  {option.coinLstID} - {option.coinName}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              className="popup-text"
              label="Giá $ lúc mua"
              id=""
              type="number"
              value={investExRate}
              onChange={onChangeUSD}
            />
            <TextField
              className="popup-text"
              label="Số tiền VND mua"
              id=""
              type="number"
              value={investMoney}
              onChange={onChangeVND}
            />
            <TextField
              disabled
              className="popup-text"
              label="Số coin mua được"
              id=""
              type="number"
              value={investNumCoin}
            />
            <TextField
              disabled
              className="popup-text"
              label="USDT lúc nhận"
              id=""
              type="number"
              value={investReUSDT}
            />
          </div>
          <div className="right-group-input">
            {" "}
            <TextField
              className="popup-text"
              required
              label="Ngày bán Coin"
              id=""
              type="date"
              value={investSeDate}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setInvestSeDate(e.target.value)}
            />
            <TextField
              className="popup-text"
              label="Giá $ lúc bán"
              id=""
              type="number"
              value={investSeExRate}
              onChange={onchangeUSDSell}
            />
            <TextField
              disabled
              className="popup-text"
              label="USDT lúc bán"
              id=""
              type="number"
              value={investSeUSDT}
            />
            <TextField
              disabled
              className="popup-text"
              label="Số tiền VND thu về"
              id=""
              type="number"
              value={investReMoney}
            />
            <TextField
              className="popup-text"
              id="outlined-select-currency"
              select
              label="Trạng thái"
              value={investStatus}
              defaultValue=""
              onChange={(e) => setInvestStatus(e.target.value)}
            >
              {StatusSav.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              disabled
              className="popup-text"
              id=""
              label="Lãi/Lỗ"
              value={investResult}
              defaultValue=""
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
export default InvestmentEditor;
