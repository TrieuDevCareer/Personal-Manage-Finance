/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
// import "./ErrorMessage.scss";
import { useNavigate } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Table from "../../misc/table.js";
import SavingEditor from "./savingEditor.js";
import AuthPage from "../../auth/authPage.js";
import LoadingProgess from "../../misc/loadingProgess.js";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import "./saving.scss";

function Saving({ isCheck, setIsCheck }) {
  const [savingData, setSavingData] = useState();
  const [savingEditorOpen, setSavingEditorOpen] = useState(false);
  const [editSavingData, setEditSavingData] = useState(null);
  const [savingReportTotal, setSavingReportTotal] = useState();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const aTitle = [
    "NGÀY THÁNG",
    "DANH MỤC GTK",
    "SỐ TIỀN GỬI",
    "SỐ THÁNG GỬI",
    "LÃI/NĂM(%)",
    "TỔNG LÃI NHẬN ĐƯỢC",
    "TỔNG SỐ TIỀN SAU KHI GỬI(GỒM CẢ LÃI)",
    "TRẠNG THÁI",
    "SỐ TIỀN THỰC TẾ NHẬN ĐƯỢC KHI RÚT",
    "SỐ TIỀN CHÊNH LỆCH SAU KHI RÚT",
  ];
  const aKeyItem = [
    "stt",
    "savDate",
    "bnkName",
    "savMoney",
    "savMonth",
    "savInteret",
    "savInteretMoney",
    "savTotalMoney",
    "savStatus",
    "savTRealMoney",
    "savRealInterMoney",
  ];
  const oRouter = {
    router: "saving",
    name: "Bảng tiết kiệm",
  };
  const bStatusSaving = {
    true: "Đã rút",
    false: "Đang gửi",
  };
  function editSaving(savingData) {
    setEditSavingData(savingData);
    setSavingEditorOpen(true);
  }

  async function getSavings() {
    const savings = await Axios.get(`${domain}/saving/`);
    savings.data.map((i) => {
      i.savMoney = i.savMoney.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      });
      i.savInteretMoney = i.savInteretMoney.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      });
      i.savTotalMoney = i.savTotalMoney.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      });
      i.savTRealMoney = i.savTRealMoney.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      });
      i.savRealInterMoney = i.savRealInterMoney.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      });
      let today = i.savDate;
      today = Date.parse(today);
      i.savDate = new Date(today).toISOString().split("T")[0];
      return (
        i.savMoney,
        i.savInteretMoney,
        i.savTotalMoney,
        i.savTRealMoney,
        i.savRealInterMoney,
        i.savDate
      );
    });
    setSavingData(savings.data);
  }

  async function handleGetSavingReportTotal() {
    const resultData = await Axios.get(`${domain}/saving/reporttotaldata`);
    setSavingReportTotal(resultData.data);
  }

  useEffect(() => {
    if (!user) setSavingData();
    else {
      getSavings();
      handleGetSavingReportTotal();
    }
  }, [user]);
  return (
    <div>
      {user && !savingData && !savingReportTotal && <LoadingProgess />}
      {user && savingData && savingReportTotal && (
        <div className="saving-container">
          <div className="title-saving">DANH SÁCH GỬI TIẾT KIỆM</div>
          {savingEditorOpen ? (
            <SavingEditor
              getSavings={getSavings}
              setSavingEditorOpen={setSavingEditorOpen}
              editSavingData={editSavingData}
            />
          ) : (
            <div>
              <div className="report-saving">
                <div className="report-item">
                  <p>Số tiền tiết kiệm ban đầu:</p>
                  <span>{savingReportTotal.iReportStartMon}</span>
                </div>
                <div className="report-item">
                  <p>Tổng số tiền nếu rút hết TKTK:</p>
                  <span>{savingReportTotal.iReportTotalMon}</span>
                </div>
                <div className="report-item">
                  <p>Tổng số tiền chưa gửi tiết kiệm</p>
                  <span>{savingReportTotal.iUnsavedAmount}</span>
                </div>
                <div className="report-item">
                  <p>Tổng số tiền đang gửi tiết kiệm:</p>
                  <span>{savingReportTotal.iSavingAmount}</span>
                </div>
                <div className="report-item">
                  <p>Tổng số tiền lãi có thể nhận được :</p>
                  <span>{savingReportTotal.iAmountOfInterest}</span>
                </div>
              </div>
              <Table
                oData={savingData}
                aKeyItem={aKeyItem}
                aTitle={aTitle}
                rowsPerPage={8}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                editModel={editSaving}
                oRouter={oRouter}
                bStatus={bStatusSaving}
                colorTitle={"#0ecb74"}
              />
            </div>
          )}
          {!savingEditorOpen && (
            <div className="footer-link" onClick={() => navigate("/banklist")}>
              <OpenInNewIcon />
              <div className="footer-titel">DANH MỤC NGÂN HÀNG</div>
            </div>
          )}
        </div>
      )}
      {user === null && <AuthPage />}
    </div>
  );
}

export default Saving;
