import React, { useContext } from "react";
// import "./ErrorMessage.scss";
import { useNavigate } from "react-router-dom";
import { Stack, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import "./catalog.scss";
import UserContext from "../../../context/UserContext.js";
import IncomeList from "../incomeList/incomeList.js";
import ExpenseList from "../expenseList/expenseList.js";

function Catalog() {
  // const aTitleIncome = ["DANH MỤC THU", "MÃ"];
  // const aTitleExpense = ["DANH MỤC CHI", "MÃ"];
  // const aTitleInvest = ["DANH MỤC COIN"];
  // const aTitleSaving = ["DANH MỤC BANK"];
  // const aTitleInvestSta = ["TRẠNG THÁI COIN"];
  // const aTitleSavingSta = ["TRẠNG THÁI BANK"];
  // const aTitleLink = ["DANH MỤC LINK"];
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <div>
      {user && (
        <div className="catalog-container">
          <div className="title-catalog">DANH MỤC</div>
          <div className="catalog-table-container">
            <div className="catalog-income">
              <IncomeList isCatalogPage={true} />
            </div>
            <div className="catalog-expense">
              <ExpenseList isCatalogPage={true} />
            </div>
            {/* <div className="catalog-group">
              <div className="catalog-frs-group">
                <div className="catalog-saving">
                  <Table
                    oData={oDataGenerate}
                    aTitle={aTitleSaving}
                    rowsPerPage={3}
                    isCheck={isCheck}
                    setIsCheck={setIsCheck}
                    colorTitle={"#21a0ff"}
                  />
                </div>
                <div className="catalog-invest">
                  <Table
                    oData={oDataGenerate}
                    aTitle={aTitleInvest}
                    rowsPerPage={3}
                    isCheck={isCheck}
                    setIsCheck={setIsCheck}
                    colorTitle={"#ffd966"}
                  />
                </div>
              </div>
              <div className="catalog-snd-group">
                <div className="catalog-status-saving">
                  <Table
                    oData={oDataGenerate}
                    aTitle={aTitleSavingSta}
                    rowsPerPage={2}
                    isCheck={isCheck}
                    setIsCheck={setIsCheck}
                    colorTitle={"#21a0ff"}
                  />
                </div>
                <div className="catalog-status-invest">
                  <Table
                    oData={oDataGenerate}
                    aTitle={aTitleInvestSta}
                    rowsPerPage={2}
                    isCheck={isCheck}
                    setIsCheck={setIsCheck}
                    colorTitle={"#ffd966"}
                  />
                </div>
              </div>
              <div className="catalog-link">
                <div className="catalog-link-style">
                  <Table
                    oData={oDataGenerate}
                    aTitle={aTitleLink}
                    rowsPerPage={3}
                    isCheck={isCheck}
                    setIsCheck={setIsCheck}
                    colorTitle={"#70ad47"}
                  />
                </div>
              </div>
            </div> */}
          </div>
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

export default Catalog;
