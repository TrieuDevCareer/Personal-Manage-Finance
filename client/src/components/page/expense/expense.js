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
import ExpenseEditor from "./expenseEditor.js";
import LoadingProgess from "../../misc/loadingProgess.js";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import "./expense.scss";

function Expense({ isCheck, setIsCheck }) {
  const [expenseData, setExpenseData] = useState([]);
  const [expenseEditorOpen, setExpenseEditorOpen] = useState(false);
  const [editExpenseData, setEditExpenseData] = useState(null);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const aKeyItem = ["stt", "expDate", "exeLstContent", "exelstCode", "expDetail", "expMoney"];

  const oRouter = {
    router: "expense",
    name: "Bảng chi tiêu",
  };

  const aTitle = ["NGÀY THÁNG", "DANH MỤC CHI", " QUỸ-TÀI KHOẢN", "NỘI DUNG CHI", "SỐ TIỀN CHI"];
  function editExpense(expenseData) {
    setEditExpenseData(expenseData);
    setExpenseEditorOpen(true);
  }

  async function getExpenses() {
    const expenses = await Axios.get(`${domain}/expense/`);
    expenses.data.map((i) => {
      i.expMoney = i.expMoney.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      });
      let today = i.expDate;
      today = Date.parse(today);
      i.expDate = new Date(today).toISOString().split("T")[0];
      // eslint-disable-next-line no-sequences
      return i.expMoney, i.expDate;
    });
    setExpenseData(expenses.data);
  }

  useEffect(() => {
    if (!user) setExpenseData([]);
    else getExpenses();
  }, [user]);
  return (
    <div>
      {user && expenseData.length === 0 && <LoadingProgess />}
      {user && expenseData.length > 0 && (
        <div className="expense-container">
          <div className="title-expense">DANH SÁCH CÁC KHOẢN CHI</div>

          {expenseEditorOpen ? (
            <ExpenseEditor
              getExpenses={getExpenses}
              setExpenseEditorOpen={setExpenseEditorOpen}
              editExpenseData={editExpenseData}
            />
          ) : (
            <div>
              <Table
                oData={expenseData}
                aKeyItem={aKeyItem}
                aTitle={aTitle}
                rowsPerPage={10}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                editModel={editExpense}
                oRouter={oRouter}
                colorTitle={"#ff007f"}
              />
            </div>
          )}
          {!expenseEditorOpen && (
            <div className="footer-link" onClick={() => navigate("/expenselist")}>
              <OpenInNewIcon />
              <div className="footer-titel">DANH MỤC CHI TIÊU</div>
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

export default Expense;
