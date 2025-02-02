import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Box from "@mui/material/Box";
import { Stack, Button, TextField } from "@mui/material";
import domain from "../../util/domain";
import UserContext from "../../context/UserContext";
import LoadingProgess from "../misc/loadingProgess.js";
import ErrorMessage from "../misc/ErrorMessage";
import "./auth.scss";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneWidth, setPhoneWidth] = useState("windown");

  const { getUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();
    setIsLoading(true);
    const loginData = {
      email,
      password,
    };

    try {
      await Axios.post(`${domain}/auth/login`, loginData);
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        if (err.response.data.errorMessage) {
          setMessage(err.response.data.errorMessage);
        }
      }
      return;
    }

    await getUser();
    navigate("/");
  }
  useEffect(() => {
    if (window.outerWidth <= 739) {
      setPhoneWidth("phone");
    } else setPhoneWidth("windown");
  }, [phoneWidth, isLoading]);
  return (
    <div className="auth-container">
      {isLoading && <LoadingProgess />}
      {!isLoading && (
        <div className="box-container">
          <div className="title-auth">ĐĂNG NHẬP TÀI KHOẢN NGƯỜI DÙNG</div>
          <Box
            className="auth-form"
            component="form"
            sx={{
              "& > :not(style)": {
                m: 1,
                width: phoneWidth === "phone" ? "100%" : "40rem",
                paddingRight: "2%",
              },
            }}
            noValidate
            autoComplete="off"
            onSubmit={login}
          >
            <ErrorMessage message={message} setMessage={setMessage} />
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
            <Stack spacing={2} direction="row" justifyContent="right" className="btn-control">
              <Button
                variant="contained"
                color="success"
                size={phoneWidth === "phone" ? "small" : "medium"}
                type="submit"
              >
                Đăng Nhập
              </Button>
              <Button
                variant="contained"
                color="error"
                size={phoneWidth === "phone" ? "small" : "medium"}
                onClick={() => navigate("/")}
              >
                Hủy
              </Button>
            </Stack>
          </Box>
        </div>
      )}
    </div>
  );
}
export default Login;
