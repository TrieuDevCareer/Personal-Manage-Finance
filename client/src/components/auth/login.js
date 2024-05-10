import React, { useState, useContext } from "react";
import Axios from "axios";
import Box from "@mui/material/Box";
import { Stack, Button, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import domain from "../../util/domain";
import UserContext from "../../context/UserContext";
import "./auth.scss";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { getUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();

    const loginData = {
      email,
      password,
    };

    try {
      await Axios.post(`${domain}/auth/login`, loginData);
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
    navigate("/income");
  }
  return (
    <div className="auth-container">
      <div>
        <div className="title-auth">ĐĂNG NHẬP TÀI KHOẢN NGƯỜI DÙNG</div>
        <Box
          className="auth-form"
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "40rem" },
          }}
          noValidate
          autoComplete="off"
          onSubmit={login}
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
            label="Mật khẩu"
            id="fullWidth"
            type="password"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Stack spacing={2} direction="row" justifyContent="right">
            <Button variant="contained" color="success" size="medium" type="submit">
              Đăng Nhập
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
export default Login;
