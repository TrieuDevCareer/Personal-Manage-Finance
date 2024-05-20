import React, { useState, useContext } from "react";
import Axios from "axios";
import Box from "@mui/material/Box";
import { Stack, Button, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import domain from "../../util/domain";
import UserContext from "../../context/UserContext";
import "./auth.scss";

function Register() {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [walletLife, setWalletLife] = useState(0);
  const [walletInvest, setWalletInvest] = useState(0);
  const [walletSaving, setWalletSaving] = useState(0);
  const [walletFree, setWalletFree] = useState(0);

  const { getUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function register(e) {
    e.preventDefault();

    const registerData = {
      email,
      userName,
      password,
      passwordVerify,
      walletLife,
      walletInvest,
      walletSaving,
      walletFree,
    };

    try {
      await Axios.post(`${domain}/auth/`, registerData);
    } catch (err) {
      if (err.response) {
        if (err.response.data.errorMessage) {
          // setErrorMessage(err.response.data.errorMessage);
          console.log(err.response.data.errorMessage);
        }
      }
      return;
    }

    await getUser();
    navigate("/");
  }
  return (
    <div className="auth-container">
      <div>
        <div className="title-auth">ĐĂNG KÝ TÀI KHOẢN NGƯỜI DÙNG</div>
        <Box
          className="auth-form"
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "40rem" },
          }}
          noValidate
          autoComplete="off"
          onSubmit={register}
        >
          <TextField
            className="auth-text"
            fullWidth
            label="Email đăng nhập"
            id="fullWidth"
            type="text"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            className="auth-text"
            fullWidth
            label="Tên người dùng"
            id="fullWidth"
            type="text"
            size="small"
            color="success"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <TextField
            className="auth-text"
            fullWidth
            label="Mật khẩu"
            id="fullWidth"
            type="password"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            className="auth-text"
            fullWidth
            label="Xác thực mật khẩu"
            id="fullWidth"
            type="password"
            size="small"
            value={passwordVerify}
            onChange={(e) => setPasswordVerify(e.target.value)}
          />
          <TextField
            className="auth-text"
            fullWidth
            label="Quỹ hằng ngày"
            id="fullWidth"
            type="number"
            size="small"
            value={walletLife}
            onChange={(e) => setWalletLife(e.target.value)}
          />
          <TextField
            className="auth-text"
            fullWidth
            label="Quỹ tiết kiệm"
            id="fullWidth"
            type="number"
            size="small"
            value={walletInvest}
            onChange={(e) => setWalletInvest(e.target.value)}
          />
          <TextField
            className="auth-text"
            fullWidth
            label="Quỹ đầu tư"
            id="fullWidth"
            type="number"
            size="small"
            value={walletSaving}
            onChange={(e) => setWalletSaving(e.target.value)}
          />
          <TextField
            className="auth-text"
            fullWidth
            label="Quỹ tự do"
            id="fullWidth"
            type="number"
            size="small"
            value={walletFree}
            onChange={(e) => setWalletFree(e.target.value)}
          />
          <Stack spacing={2} direction="row" justifyContent="right">
            <Button variant="contained" color="success" size="medium" type="submit">
              Đăng ký
            </Button>
            <Button variant="contained" color="error" size="medium" onClick={() => navigate("/")}>
              Hủy
            </Button>
          </Stack>
        </Box>
      </div>
    </div>
  );
}
export default Register;
