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
import ExpenseListEditor from "./expenseListEditor.js";
import LoadingProgess from "../../misc/loadingProgess.js";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import "./expenseList.scss";

function ExpenseList({ isCheck, setIsCheck, isCatalogPage }) {
  const [expenseListData, setExpenseListData] = useState();
  const [expenseListEditorOpen, setExpenseListEditorOpen] = useState(false);
  const [editExpenseListData, setEditExpenseListData] = useState(null);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const aTitle = isCatalogPage ? ["QUỸ", "NỘI DUNG CHI TIÊU"] : ["NGUỒN QUỸ", "NỘI DUNG CHI TIÊU"];
  const aKeyItem = ["stt", "exelstCode", "exeLstContent"];
  const oRouter = {
    router: "expenselist",
    name: "Danh mục chi tiêu",
  };

  function editExpenseList(expenseListData) {
    setEditExpenseListData(expenseListData);
    setExpenseListEditorOpen(true);
  }

  async function getExpenseLists() {
    const expenseLists = await Axios.get(`${domain}/expenselist/`);
    setExpenseListData(expenseLists.data);
  }

  useEffect(() => {
    if (!user) setExpenseListData();
    else getExpenseLists();
  }, [user]);
  return (
    <div>
      {user && !expenseListData && <LoadingProgess />}
      {user && expenseListData && (
        <div className="expenseList-container">
          <div className="title-container">
            {!isCatalogPage && <div className="title-expenseList">DANH MỤC CHI TIÊU</div>}
          </div>

          {expenseListEditorOpen ? (
            <ExpenseListEditor
              getExpenseLists={getExpenseLists}
              setExpenseListEditorOpen={setExpenseListEditorOpen}
              editExpenseListData={editExpenseListData}
            />
          ) : (
            <div>
              <Table
                oData={expenseListData}
                aKeyItem={aKeyItem}
                aTitle={aTitle}
                rowsPerPage={10}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                editModel={editExpenseList}
                oRouter={oRouter}
                isCatalogPage={isCatalogPage}
                colorTitle={"#ff007f"}
              />
            </div>
          )}
          {!expenseListEditorOpen && !isCatalogPage && (
            <div className="footer-link" onClick={() => navigate("/expense")}>
              <OpenInNewIcon />
              <div className="footer-titel">DANH SÁCH CÁC KHOẢN CHI</div>
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

export default ExpenseList;
