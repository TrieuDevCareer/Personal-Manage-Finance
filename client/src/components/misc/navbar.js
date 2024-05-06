import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import "./ErrorMessage.scss";
import "./navbar.scss";

function Navbar({ clickPattern, setClickPattern }) {
  let [styleIncome, setStyleIncome] = useState("txt-style default-color");
  let [styleExpense, setStyleExpense] = useState("txt-style default-color");
  let [styleSaving, setStyleSaving] = useState("txt-style default-color");
  let [styleInvest, setStyleInvest] = useState("txt-style default-color");
  let [styleContent, setStyleContent] = useState("txt-style default-color");
  let [styleTotal, setStyleTotal] = useState("txt-style default-color");

  function onClickHeaderBtn(typeBtn) {
    setClickPattern("navbar");
    switch (typeBtn) {
      case "Income":
        setStyleIncome("txt-style gradient-color");
        setStyleExpense("txt-style default-color");
        setStyleInvest("txt-style default-color");
        setStyleSaving("txt-style default-color");
        setStyleContent("txt-style default-color");
        setStyleTotal("txt-style default-color");
        break;
      case "Expense":
        setStyleIncome("txt-style default-color");
        setStyleExpense("txt-style gradient-color");
        setStyleInvest("txt-style default-color");
        setStyleSaving("txt-style default-color");
        setStyleContent("txt-style default-color");
        setStyleTotal("txt-style default-color");
        break;
      case "Saving":
        setStyleIncome("txt-style default-color");
        setStyleExpense("txt-style default-color");
        setStyleInvest("txt-style default-color");
        setStyleSaving("txt-style gradient-color");
        setStyleContent("txt-style default-color");
        setStyleTotal("txt-style default-color");
        break;
      case "Content":
        setStyleIncome("txt-style default-color");
        setStyleExpense("txt-style default-color");
        setStyleInvest("txt-style default-color");
        setStyleSaving("txt-style default-color");
        setStyleContent("txt-style gradient-color");
        setStyleTotal("txt-style default-color");
        break;
      case "Total":
        setStyleIncome("txt-style default-color");
        setStyleExpense("txt-style default-color");
        setStyleInvest("txt-style default-color");
        setStyleSaving("txt-style default-color");
        setStyleContent("txt-style default-color");
        setStyleTotal("txt-style gradient-color");
        break;
      default:
        setStyleIncome("txt-style default-color");
        setStyleExpense("txt-style default-color");
        setStyleInvest("txt-style gradient-color");
        setStyleSaving("txt-style default-color");
        setStyleContent("txt-style default-color");
        setStyleTotal("txt-style default-color");
        break;
    }
    return;
  }
  useEffect(() => {
    if (clickPattern !== "navbar") {
      setStyleIncome("txt-style default-color");
      setStyleExpense("txt-style default-color");
      setStyleInvest("txt-style default-color");
      setStyleSaving("txt-style default-color");
      setStyleContent("txt-style default-color");
      setStyleTotal("txt-style default-color");
    }
  }, [clickPattern]);
  return (
    <div className="vertical-nav">
      <ul className="list-nav">
        <li>
          <img
            src="https://bootstrapious.com/i/snippets/sn-v-nav/avatar.png"
            alt="..."
            width="65"
            className="mr-3 rounded-circle img-thumbnail shadow-sm"
          />
        </li>
        <li>
          <Link className={styleIncome} to="/income" onClick={() => onClickHeaderBtn("Income")}>
            <p>Thu</p>
          </Link>
        </li>
        <li>
          <Link className={styleExpense} to="/expense" onClick={() => onClickHeaderBtn("Expense")}>
            <p>Chi</p>
          </Link>
        </li>
        <li>
          <Link className={styleSaving} to="/saving" onClick={() => onClickHeaderBtn("Saving")}>
            <p>Tiết kiệm</p>
          </Link>
        </li>
        <li>
          <Link className={styleInvest} to="/invest" onClick={() => onClickHeaderBtn("Invest")}>
            <p>Đầu tư</p>
          </Link>
        </li>
        <li>
          <Link className={styleContent} to="/invest" onClick={() => onClickHeaderBtn("Content")}>
            <p>Danh mục</p>
          </Link>
        </li>
        <li>
          <Link className={styleTotal} to="/invest" onClick={() => onClickHeaderBtn("Total")}>
            <p>Tổng hợp</p>
          </Link>
        </li>
      </ul>
      <div className="line-nav"></div>
      <div className="vertical-line-nav"></div>
    </div>
  );
}

export default Navbar;
