import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";
// import "./ErrorMessage.scss";
import { Link } from "react-router-dom";
import domain from "../../util/domain";
import UserContext from "../../context/UserContext";
import "./header.scss";

function Header({ clickPattern, setClickPattern }) {
  let [styleIncome, setStyleIncome] = useState("box-bg default-btn");
  let [styleExpense, setStyleExpense] = useState("box-bg default-btn");
  let [styleSaving, setStyleSaving] = useState("box-bg default-btn");
  let [styleInvest, setStyleInvest] = useState("box-bg default-btn");
  const { user } = useContext(UserContext);

  function onClickHeaderBtn(typeBtn) {
    setClickPattern("header");
    switch (typeBtn) {
      case "Income":
        setStyleIncome("box-bg gradient-btn");
        setStyleExpense("box-bg default-btn");
        setStyleInvest("box-bg default-btn");
        setStyleSaving("box-bg default-btn");
        break;
      case "Expense":
        setStyleIncome("box-bg default-btn");
        setStyleExpense("box-bg gradient-btn");
        setStyleInvest("box-bg default-btn");
        setStyleSaving("box-bg default-btn");
        break;
      case "Saving":
        setStyleIncome("box-bg default-btn");
        setStyleExpense("box-bg default-btn");
        setStyleInvest("box-bg default-btn");
        setStyleSaving("box-bg gradient-btn");
        break;
      default:
        setStyleIncome("box-bg default-btn");
        setStyleExpense("box-bg default-btn");
        setStyleInvest("box-bg gradient-btn");
        setStyleSaving("box-bg default-btn");
        break;
    }
    return;
  }
  async function logOut() {
    if (window.confirm(`Bạn muốn đăng xuất khỏi tài khoản, ${user.userName}?`)) {
      if (window.confirm(`Tạm biệt, sớm gặp lại bạn nhé ${user.userName}`)) {
        await Axios.get(`${domain}/auth/logOut`);
        window.location.reload();
      }
    }
  }
  useEffect(() => {
    if (clickPattern !== "header") {
      setStyleIncome("box-bg default-btn");
      setStyleExpense("box-bg default-btn");
      setStyleInvest("box-bg default-btn");
      setStyleSaving("box-bg default-btn");
    }
  }, [clickPattern, user]);
  return (
    <div className="header-container">
      <div className={styleIncome}>
        <Link className="txt-style" to="/incomereport" onClick={() => onClickHeaderBtn("Income")}>
          <img src={"/images/income.png"} alt="..." className="nav-icon" />
          <p>Báo cáo thu</p>
        </Link>
      </div>
      <div className={styleExpense}>
        <Link className="txt-style" to="/expensereport" onClick={() => onClickHeaderBtn("Expense")}>
          <img src={"/images/expense.png"} alt="..." className="nav-icon" />
          <p>Báo cáo chi</p>
        </Link>
      </div>
      <div className={styleSaving}>
        <Link className="txt-style" to="/savingreport" onClick={() => onClickHeaderBtn("Saving")}>
          <img src={"/images/saving.png"} alt="..." className="nav-icon" />
          <p>Báo cáo Tiết kiệm</p>
        </Link>
      </div>
      <div className={styleInvest}>
        <Link className="txt-style" to="/investreport" onClick={() => onClickHeaderBtn("Invest")}>
          <img src={"/images/invest.png"} alt="..." className="nav-icon" />
          <p>Báo cáo Đầu tư</p>
        </Link>
      </div>

      {user && (
        <div className="title-root">
          <div className="tile-userName">Welcome, {user.userName}</div>
          <LogoutIcon className="btn-style-edit" onClick={() => logOut()} />
        </div>
      )}
    </div>
  );
}

export default Header;
