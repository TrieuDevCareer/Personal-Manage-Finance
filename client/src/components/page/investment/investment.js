/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
// import "./ErrorMessage.scss";
import { useNavigate } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Table from "../../misc/table.js";
import InvestEditor from "./investEditor.js";
import AuthPage from "../../auth/authPage.js";
import LoadingProgess from "../../misc/loadingProgess.js";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import "./investment.scss";

function Investment({ isCheck, setIsCheck }) {
  const [investmentData, setInvestmentData] = useState();
  const [investmentEditorOpen, setInvestmentEditorOpen] = useState(false);
  const [editInvestmentData, setEditInvestmentData] = useState(null);
  const [investReportTotal, setInvestReportTotal] = useState();
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
    "coinLstID",
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

  const bStatusInvest = {
    true: "Đã rút",
    false: "Đang gửi",
  };
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
      i.investExRate = i.investExRate ? i.investExRate : 0;
      i.investMoney = i.investMoney ? i.investMoney : 0;
      i.investSeUSDT = i.investSeUSDT ? i.investSeUSDT : 0;
      i.investSeExRate = i.investSeExRate ? i.investSeExRate : 0;
      i.investReMoney = i.investReMoney ? i.investReMoney : 0;
      i.investResult = i.investResult ? i.investResult : 0;
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
      return (
        i.investExRate, i.investMoney, i.investSeUSDT, i.investReMoney, i.investDate, i.investSeDate
      );
    });
    setInvestmentData(investments.data);
  }

  async function handleGetInvestReportTotal() {
    const resultData = await Axios.get(`${domain}/investment/reporttotaldata`);
    setInvestReportTotal(resultData.data);
  }

  useEffect(() => {
    if (!user) setInvestmentData();
    else {
      getInvestments();
      handleGetInvestReportTotal();
    }
  }, [user]);
  return (
    <div>
      {user && !investmentData && !investReportTotal && <LoadingProgess />}
      {user && investReportTotal && investmentData && (
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
                    <span>{investReportTotal.investmentAmount}</span>
                  </div>
                  <div className="report-item">
                    <p>Tổng số tiền chưa đem đi đầu tư:</p>
                    <span>{investReportTotal.nonInvestAmount}</span>
                  </div>
                  <div className="report-item">
                    <p>Tổng số tiền có thể lãi lỗ:</p>
                    <span>{investReportTotal.profitAmount}</span>
                  </div>
                </div>
              </div>
              <Table
                oData={investmentData}
                aKeyItem={aKeyItem}
                aTitle={aTitle}
                rowsPerPage={8}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                editModel={editInvestment}
                oRouter={oRouter}
                bStatus={bStatusInvest}
                colorTitle={"#ff007f"}
              />
            </div>
          )}
          {!investmentEditorOpen && (
            <div className="footer-link" onClick={() => navigate("/coinlist")}>
              <OpenInNewIcon />
              <div className="footer-titel">DANH MỤC ĐỒNG COIN</div>
            </div>
          )}
        </div>
      )}
      {user === null && <AuthPage />}
    </div>
  );
}

export default Investment;
