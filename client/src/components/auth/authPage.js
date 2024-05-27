import React from "react";
import { useNavigate } from "react-router-dom";
import { Stack, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import "./authPage.scss";
function AuthPage() {
  const navigate = useNavigate();
  return (
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
  );
}
export default AuthPage;
