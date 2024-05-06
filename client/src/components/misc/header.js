import React, { useState } from "react";
// import "./ErrorMessage.scss";
import { Link, useNavigate } from "react-router-dom";
import "./header.scss";

function Header() {
  let [styleIncome, setStyleIncome] = useState("box-bg default-btn");
  let [styleExpense, setStyleExpense] = useState("box-bg default-btn");
  let [styleSaving, setStyleSaving] = useState("box-bg default-btn");
  let [styleInvest, setStyleInvest] = useState("box-bg default-btn");

  function onClickHeaderBtn(typeBtn) {
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

  return (
    <div className="header-container">
      <div className={styleIncome}>
        <Link className="txt-style" to="/expense" onClick={() => onClickHeaderBtn("Income")}>
          <p>Báo cáo thu</p>
        </Link>
      </div>
      <div className={styleExpense}>
        <Link className="txt-style" to="/expense" onClick={() => onClickHeaderBtn("Expense")}>
          <p>Báo cáo chi</p>
        </Link>
      </div>
      <div className={styleSaving}>
        <Link className="txt-style" to="/expense" onClick={() => onClickHeaderBtn("Saving")}>
          <p>Báo cáo Tiết kiệm</p>
        </Link>
      </div>
      <div className={styleInvest}>
        <Link className="txt-style" to="/expense" onClick={() => onClickHeaderBtn("Invest")}>
          <p>Báo cáo Đầu tư</p>
        </Link>
      </div>
    </div>
  );
}

export default Header;
