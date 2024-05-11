/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
// import "./ErrorMessage.scss";
import { useNavigate } from "react-router-dom";
import { Stack, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Table from "../../misc/table.js";
import InvestEditor from "./investEditor.js";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import "./investment.scss";

function Investment({ isCheck, setIsCheck }) {
  const [investmentData, setInvestmentData] = useState([]);
  const [investmentEditorOpen, setInvestmentEditorOpen] = useState(false);
  const [editInvestmentData, setEditInvestmentData] = useState(null);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const aTitle = [
    "NGÀY MUA",
    "MÃ COIN",
    "GIÁ $ LÚC MUA",
    "VNĐ MUA",
    "SỐ COIN",
    "USDT NHẬN",
    "TÌNH TRẠNG",
    "NGÀY BÁN",
    "GIÁ $ LÚC BÁN",
    "USDT LÚC BÁN",
    "VNĐ THU VỀ",
    "LÃI/LỖ",
  ];
  const aKeyItem = [
    "stt",
    "investDate",
    "coinName",
    "investExRate",
    "investMoney",
    "investNumCoin",
    "investReUSDT",
    "investStatus",
    "investSeDate",
    "investSeExRate",
    "investSeUSDT",
    "investReMoney",
    "investResult",
  ];
  const oRouter = {
    router: "investment",
    name: "Bảng Đầu tư",
  };

  function editInvestment(investmentData) {
    setEditInvestmentData(investmentData);
    setInvestmentEditorOpen(true);
  }

  async function getInvestments() {
    const investments = await Axios.get(`${domain}/investment/`);
    investments.data.map((i) => {
      i.investExRate = i.investExRate.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      i.investMoney = i.investMoney.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      });
      i.investSeUSDT = i.investSeUSDT.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      i.investSeExRate = i.investSeExRate.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      i.investReMoney = i.investReMoney.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      });
      i.investResult = i.investResult.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      });
      let today = i.investDate;
      today = Date.parse(today);
      i.investDate = new Date(today).toISOString().split("T")[0];
      today = i.investSeDate;
      today = Date.parse(today);
      i.investSeDate = new Date(today).toISOString().split("T")[0];
      // eslint-disable-next-line no-sequences
      return (
        i.investExRate, i.investMoney, i.investSeUSDT, i.investReMoney, i.investDate, i.investSeDate
      );
    });
    setInvestmentData(investments.data);
  }

  useEffect(() => {
    if (!user) setInvestmentData([]);
    else getInvestments();
  }, [user]);
  return (
    <div>
      {user && (
        <div className="investment-container">
          <div className="title-investment">DANH SÁCH ĐẦU TƯ</div>
          {investmentEditorOpen ? (
            <InvestEditor
              getInvestments={getInvestments}
              setInvestmentEditorOpen={setInvestmentEditorOpen}
              editInvestmentData={editInvestmentData}
            />
          ) : (
            <div>
              <div className="report-investment">
                <div className="report-invest">
                  <div className="report-item">
                    <p>Số tiền đầu tư có thể có:</p>
                    <span>xyz</span>
                  </div>
                  <div className="report-item">
                    <p>Tổng số tiền chưa đem đi đầu tư:</p>
                    <span>xyz</span>
                  </div>
                  <div className="report-item">
                    <p>Tổng số tiền có thể lãi lỗ:</p>
                    <span>xyz</span>
                  </div>
                </div>
              </div>
              <Table
                oData={investmentData}
                aKeyItem={aKeyItem}
                aTitle={aTitle}
                rowsPerPage={10}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                editModel={editInvestment}
                oRouter={oRouter}
                colorTitle={"#0ecb74"}
              />
            </div>
          )}
        </div>
      )}
      {user === null && (
        <div className="auth-container">
          <div className="auth-style">
            <h1 className="auth-ele auth-title">HỆ THỐNG QUẢN LÝ TÀI CHÍNH CÁ NHÂN</h1>
            <h3 className="auth-ele auth-desc">Quản lý theo cách bạn muốn</h3>

            <Stack spacing={2} direction="row" justifyContent="center">
              <Button
                variant="contained"
                color="success"
                size="medium"
                startIcon={<LoginIcon />}
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </Button>
              <Button
                variant="contained"
                color="info"
                startIcon={<HowToRegIcon />}
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </Button>
            </Stack>
          </div>
        </div>
      )}
    </div>
  );
}

export default Investment;
