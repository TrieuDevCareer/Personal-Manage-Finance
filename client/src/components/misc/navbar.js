import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import domain from "../../util/domain";
import UserContext from "../../context/UserContext.js";
import KeyboardDoubleArrowLeftSharpIcon from "@mui/icons-material/KeyboardDoubleArrowLeftSharp";
import LogoutIcon from "@mui/icons-material/Logout";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import "./navbar.scss";

function Navbar({
  clickPattern,
  setClickPattern,
  setIsCheck,
  toggleMenu,
  showMenu,
  closeMenuOnMobile,
}) {
  let [styleIncome, setStyleIncome] = useState("txt-style default-color");
  let [styleExpense, setStyleExpense] = useState("txt-style default-color");
  let [styleSaving, setStyleSaving] = useState("txt-style default-color");
  let [styleInvest, setStyleInvest] = useState("txt-style default-color");
  let [styleContent, setStyleContent] = useState("txt-style default-color");
  let [styleTotal, setStyleTotal] = useState("txt-style default-color");
  const [isPhoneWidth, setIsPhoneWidth] = useState(false);
  const { user } = useContext(UserContext);

  function onClickHeaderBtn(typeBtn) {
    setClickPattern("navbar");
    setIsCheck(false);
    closeMenuOnMobile();
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
  async function logOut() {
    if (window.confirm(`Bạn muốn đăng xuất khỏi tài khoản, ${user.userName}?`)) {
      if (window.confirm(`Tạm biệt, sớm gặp lại bạn nhé ${user.userName}`)) {
        await Axios.get(`${domain}/auth/logOut`);
        window.location.reload();
      }
    }
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
    if (window.outerWidth <= 375) {
      setIsPhoneWidth(true);
    }
  }, [clickPattern]);
  return (
    <div className="vertical-nav">
      <KeyboardDoubleArrowLeftSharpIcon
        className={`close-icon ${!showMenu ? "transition-close" : ""}`}
        onClick={toggleMenu}
      />
      <Link to="/">
        <img src={"/images/logo.png"} alt="..." className="nav-logo" />
      </Link>
      <ul className="list-nav">
        <li>
          <Link className={styleIncome} to="/income" onClick={() => onClickHeaderBtn("Income")}>
            <img src={"/images/income.png"} alt="..." className="nav-icon" />
            <p>Thu</p>
          </Link>
        </li>
        <li>
          <Link className={styleExpense} to="/expense" onClick={() => onClickHeaderBtn("Expense")}>
            <img src={"/images/expense.png"} alt="..." className="nav-icon" />
            <p>Chi</p>
          </Link>
        </li>
        <li>
          <Link className={styleSaving} to="/saving" onClick={() => onClickHeaderBtn("Saving")}>
            <img src={"/images/saving.png"} alt="..." className="nav-icon" />
            <p>Tiết kiệm</p>
          </Link>
        </li>
        <li>
          <Link className={styleInvest} to="/invest" onClick={() => onClickHeaderBtn("Invest")}>
            <img src={"/images/invest.png"} alt="..." className="nav-icon" />
            <p>Đầu tư</p>
          </Link>
        </li>
        <li>
          <Link className={styleContent} to="/catalog" onClick={() => onClickHeaderBtn("Content")}>
            <img src={"/images/content.png"} alt="..." className="nav-icon" />
            <p>Danh mục</p>
          </Link>
        </li>
        <li>
          <Link className={styleTotal} to="/generate" onClick={() => onClickHeaderBtn("Total")}>
            <img src={"/images/total.png"} alt="..." className="nav-icon" />
            <p>Tổng hợp</p>
          </Link>
        </li>
        {user && user.role === 1 && (
          <li>
            <Link className={styleTotal} to="/register">
              <HowToRegIcon className="nav-icon" />
              <p>Tạo tài khoản</p>
            </Link>
          </li>
        )}
        {user && window.outerWidth <= 375 && (
          <li>
            <Link className={styleIncome} onClick={() => logOut()}>
              <LogoutIcon className="nav-icon" />
              <p> {user.userName}</p>
            </Link>
          </li>
        )}
      </ul>
      <div className="line-nav"></div>
      <div className="vertical-line-nav"></div>
    </div>
  );
}

export default Navbar;
