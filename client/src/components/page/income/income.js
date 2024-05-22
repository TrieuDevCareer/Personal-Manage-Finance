/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
// import "./ErrorMessage.scss";
import { useNavigate } from "react-router-dom";
import { Stack, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Table from "../../misc/table.js";
import IncomeEditor from "./incomeEditor.js";
import LoadingProgess from "../../misc/loadingProgess.js";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import "./income.scss";

function Income({ isCheck, setIsCheck }) {
  const [incomeData, setIncomeData] = useState();
  const [incomeEditorOpen, setIncomeEditorOpen] = useState(false);
  const [editIncomeData, setEditIncomeData] = useState(null);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const aTitle = ["NGÀY THÁNG", "DANH MỤC THU", " QUỸ-TÀI KHOẢN", "NỘI DUNG THU", "SỐ TIỀN THU"];
  const aKeyItem = ["stt", "incDate", "inLstContent", "inlstCode", "incDetail", "incMoney"];
  const oRouter = {
    router: "income",
    name: "Bảng thu nhập",
  };

  function editIncome(incomeData) {
    setEditIncomeData(incomeData);
    setIncomeEditorOpen(true);
  }

  async function getIncomes() {
    const incomes = await Axios.get(`${domain}/income/`);
    incomes.data.map((i) => {
      i.incMoney = i.incMoney.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      });
      let today = i.incDate;
      today = Date.parse(today);
      i.incDate = new Date(today).toISOString().split("T")[0];
      // eslint-disable-next-line no-sequences
      return i.incMoney, i.incDate;
    });
    setIncomeData(incomes.data);
  }

  useEffect(() => {
    if (!user) setIncomeData();
    else getIncomes();
  }, [user]);
  return (
    <div>
      {user && !incomeData && <LoadingProgess />}
      {user && incomeData && (
        <div className="income-container">
          <div className="title-container">
            <div className="title-income">DANH SÁCH CÁC KHOẢN THU</div>
          </div>
          {incomeEditorOpen ? (
            <IncomeEditor
              getIncomes={getIncomes}
              setIncomeEditorOpen={setIncomeEditorOpen}
              editIncomeData={editIncomeData}
            />
          ) : (
            <div>
              <Table
                oData={incomeData}
                aKeyItem={aKeyItem}
                aTitle={aTitle}
                rowsPerPage={10}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                editModel={editIncome}
                oRouter={oRouter}
                colorTitle={"#0ecb74"}
              />
            </div>
          )}
          {!incomeEditorOpen && (
            <div className="footer-link" onClick={() => navigate("/incomelist")}>
              <OpenInNewIcon />
              <div className="footer-titel">DANH MỤC THU NHẬP</div>
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

export default Income;
