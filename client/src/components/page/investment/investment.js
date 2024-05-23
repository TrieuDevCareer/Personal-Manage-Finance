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
  const [investmentAmount, setInvestmentAmount] = useState(0); //Số tiền đầu tư có thể có
  const [nonInvestAmount, setNonInvestAmount] = useState(0); //Tổng số tiền chưa đem đi đầu tư
  const [profitAmount, setProfitAmount] = useState(0); //Tổng số tiền có thể lãi lỗ

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
    let iInvested = 0;
    let iProfitMoney = 0;
    investments.data.map((i) => {
      if (!i.investStatus) {
        iInvested += i.investMoney;
        iProfitMoney += i.investResult;
      }
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
      // eslint-disable-next-line no-sequences
      return (
        i.investExRate, i.investMoney, i.investSeUSDT, i.investReMoney, i.investDate, i.investSeDate
      );
    });
    setInvestmentData(investments.data);
    getUserData(iInvested, iProfitMoney);
  }

  async function getUserData(iInvested, iProfitMoney) {
    const usersData = await Axios.get(`${domain}/auth`);
    const investTotal = usersData.data.walletInvest + iInvested;
    const nonInvestTotal = usersData.data.walletInvest;
    setInvestmentAmount(
      investTotal.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      })
    );
    setNonInvestAmount(
      nonInvestTotal.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      })
    );
    setProfitAmount(
      iProfitMoney.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      })
    );
  }

  useEffect(() => {
    if (!user) setInvestmentData();
    else getInvestments();
  }, [user]);
  return (
    <div>
      {user && !investmentData && <LoadingProgess />}
      {user && investmentData && (
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
                    <span>{investmentAmount}</span>
                  </div>
                  <div className="report-item">
                    <p>Tổng số tiền chưa đem đi đầu tư:</p>
                    <span>{nonInvestAmount}</span>
                  </div>
                  <div className="report-item">
                    <p>Tổng số tiền có thể lãi lỗ:</p>
                    <span>{profitAmount}</span>
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
                bStatus={bStatusInvest}
                colorTitle={"#0ecb74"}
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
