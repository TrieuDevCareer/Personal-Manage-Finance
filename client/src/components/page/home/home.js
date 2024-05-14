import React, { useState, useContext, useEffect } from "react";
import { Stack, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { useNavigate } from "react-router-dom";
import "./home.scss";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import Axios from "axios";

function Home() {
  const [userData, setUserData] = useState([]);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  async function getUserData() {
    const incomes = await Axios.get(`${domain}/auth`);
    incomes.data.walletLife = incomes.data.walletLife.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    });
    incomes.data.walletInvest = incomes.data.walletInvest.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    });
    incomes.data.walletSaving = incomes.data.walletSaving.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    });
    incomes.data.walletFree = incomes.data.walletFree.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    });
    setUserData(incomes.data);
  }
  useEffect(() => {
    if (!user) setUserData([]);
    else getUserData();
  }, [user]);
  return (
    <div>
      {user && (
        <div className="saving-container">
          <div>Ví sống: {userData.walletLife}</div>
          <div>Ví tiết kiệm: {userData.walletSaving}</div>
          <div>Ví đầu tư: {userData.walletInvest}</div>
          <div>Ví tự do: {userData.walletFree}</div>
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
export default Home;
