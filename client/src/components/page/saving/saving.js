/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
// import "./ErrorMessage.scss";
import { useNavigate } from "react-router-dom";
import { Stack, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Table from "../../misc/table.js";
import SavingEditor from "./savingEditor.js";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import "./saving.scss";

function Saving({ isCheck, setIsCheck }) {
  const [savingData, setSavingData] = useState([]);
  const [savingEditorOpen, setSavingEditorOpen] = useState(false);
  const [editSavingData, setEditSavingData] = useState(null);

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
      // eslint-disable-next-line no-sequences
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

  useEffect(() => {
    if (!user) setSavingData([]);
    else getSavings();
  }, [user]);
  return (
    <div>
      {user && (
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
                  <span>xyz</span>
                </div>
                <div className="report-item">
                  <p>Tổng số tiền nếu rút hết TKTK:</p>
                  <span>xyz</span>
                </div>
                <div className="report-item">
                  <p>Tổng số tiền chưa gửi tiết kiệm</p>
                  <span>xyz</span>
                </div>
                <div className="report-item">
                  <p>Tổng số tiền đang gửi tiết kiệm:</p>
                  <span>xyz</span>
                </div>
                <div className="report-item">
                  <p>Tổng số tiền lãi có thể nhận được :</p>
                  <span>xyz</span>
                </div>
              </div>
              <Table
                oData={savingData}
                aKeyItem={aKeyItem}
                aTitle={aTitle}
                rowsPerPage={10}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                editModel={editSaving}
                oRouter={oRouter}
                colorTitle={"#0ecb74"}
              />
            </div>
          )}
          {!savingEditorOpen && (
            <div className="footer-link" onClick={() => navigate("/banklist")}>
              <div className="footer-titel">DANH MỤC NGÂN HÀNG</div>
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

export default Saving;
