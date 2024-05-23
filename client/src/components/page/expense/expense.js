/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
// import "./ErrorMessage.scss";
import { useNavigate } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Table from "../../misc/table.js";
import ExpenseEditor from "./expenseEditor.js";
import AuthPage from "../../auth/authPage.js";
import LoadingProgess from "../../misc/loadingProgess.js";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import "./expense.scss";

function Expense({ isCheck, setIsCheck }) {
  const [expenseData, setExpenseData] = useState();
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
    if (!user) setExpenseData();
    else getExpenses();
  }, [user]);
  return (
    <div>
      {user && !expenseData && <LoadingProgess />}
      {user && expenseData && (
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

      {user === null && <AuthPage />}
    </div>
  );
}

export default Expense;
