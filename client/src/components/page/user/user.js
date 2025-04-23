import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Box from "@mui/material/Box";
import { Stack, Button, TextField } from "@mui/material";
import domain from "../../../util/domain";
import AuthPage from "../../auth/authPage.js";
import LoadingProgess from "../../misc/loadingProgess.js";
import ErrorMessage from "../../misc/ErrorMessage";
import UserContext from "../../../context/UserContext.js";
import "./user.scss";

function User() {
  const [modeEdit, setModeEdit] = useState(false);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [salaryDate, setSalaryDate] = useState(0);
  const [dailyBudget, setDailyBudget] = useState(0);
  const [walletLife, setWalletLife] = useState(0);
  const [walletInvest, setWalletInvest] = useState(0);
  const [walletSaving, setWalletSaving] = useState(0);
  const [walletFree, setWalletFree] = useState(0);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneWidth, setPhoneWidth] = useState("windown");

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  async function updateUserInfo(e) {
    e.preventDefault();
    setIsLoading(true);
    const updateData = {
      salaryDate,
      walletLife,
      walletInvest,
      walletSaving,
      walletFree,
      dailyBudget,
    };

    try {
      await Axios.put(`${domain}/auth/`, updateData);
      navigate(0);
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        if (err.response.data.errorMessage) {
          setMessage(err.response.data.errorMessage);
        }
      }
      return;
    }
  }

  async function getUserInfo() {
    const userInfo = await Axios.get(`${domain}/auth/`);
    if (userInfo.data) {
      setEmail(userInfo.data.email ? userInfo.data.email : "");
      setUserName(userInfo.data.userName ? userInfo.data.userName : "");
      setSalaryDate(userInfo.data.salaryDate ? userInfo.data.salaryDate : null);
      setWalletLife(userInfo.data.walletLife ? userInfo.data.walletLife : 0);
      setWalletInvest(userInfo.data.walletInvest ? userInfo.data.walletInvest : 0);
      setWalletSaving(userInfo.data.walletSaving ? userInfo.data.walletSaving : 0);
      setWalletFree(userInfo.data.walletFree ? userInfo.data.walletFree : 0);
      setDailyBudget(userInfo.data.dailyBudget ? userInfo.data.dailyBudget : 0);
    }
  }

  function handleModeSystem(changeMode) {
    setModeEdit(changeMode ? changeMode : !modeEdit);
  }
  useEffect(() => {
    if (!user) setEmail();
    else getUserInfo();
    if (window.outerWidth <= 739) {
      setPhoneWidth("phone");
    } else setPhoneWidth("windown");
  }, [user]);

  return (
    <>
      {user && !email && <LoadingProgess />}
      {user && email && (
        <div className="auth-container">
          {!isLoading && (
            <div className="box-container">
              <div className="title-auth-res">THÔNG TIN NGƯỜI DÙNG</div>
              <Box
                className="auth-form"
                component="form"
                sx={{
                  "& > :not(style)": {
                    m: 1,
                    width: phoneWidth === "phone" ? "100%" : "55vw",
                  },
                }}
                noValidate
                autoComplete="on"
                onSubmit={updateUserInfo}
              >
                <ErrorMessage message={message} setMessage={setMessage} />
                <TextField
                  className="auth-text-disable"
                  label="Email đăng nhập"
                  type="text"
                  size="small"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  className="auth-text-disable"
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
                  className={modeEdit ? "auth-text-res" : "auth-text-disable"}
                  fullWidth
                  label="Budget hằng ngày"
                  id="fullWidth"
                  type="number"
                  size="small"
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(e.target.value)}
                />
                <TextField
                  className={modeEdit ? "auth-text-res" : "auth-text-disable"}
                  fullWidth
                  label="Ngày nhận lương chính"
                  id="fullWidth"
                  type="number"
                  size="small"
                  value={salaryDate}
                  onChange={(e) => setSalaryDate(e.target.value)}
                />
                <TextField
                  className={modeEdit ? "auth-text-res" : "auth-text-disable"}
                  fullWidth
                  label="Quỹ hằng ngày"
                  id="fullWidth"
                  type="number"
                  size="small"
                  value={walletLife}
                  onChange={(e) => setWalletLife(e.target.value)}
                />
                <TextField
                  className={modeEdit ? "auth-text-res" : "auth-text-disable"}
                  fullWidth
                  label="Quỹ tiết kiệm"
                  id="fullWidth"
                  type="number"
                  size="small"
                  value={walletSaving}
                  onChange={(e) => setWalletSaving(e.target.value)}
                />
                <TextField
                  className={modeEdit ? "auth-text-res" : "auth-text-disable"}
                  fullWidth
                  label="Quỹ đầu tư"
                  id="fullWidth"
                  type="number"
                  size="small"
                  value={walletInvest}
                  onChange={(e) => setWalletInvest(e.target.value)}
                />
                <TextField
                  className={modeEdit ? "auth-text-res" : "auth-text-disable"}
                  fullWidth
                  label="Quỹ tự do"
                  id="fullWidth"
                  type="number"
                  size="small"
                  value={walletFree}
                  onChange={(e) => setWalletFree(e.target.value)}
                />
                <Stack spacing={2} direction="row" justifyContent="right" className="btn-control">
                  {modeEdit && (
                    <Button
                      variant="contained"
                      color="success"
                      size={phoneWidth === "phone" ? "small" : "medium"}
                      type="submit"
                    >
                      Đăng ký
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color={modeEdit ? "error" : "secondary"}
                    size={phoneWidth === "phone" ? "small" : "medium"}
                    onClick={() => handleModeSystem()}
                  >
                    {modeEdit ? "Hủy thay đổi" : "Chỉnh sửa"}
                  </Button>
                </Stack>
              </Box>
            </div>
          )}
        </div>
      )}
      {user === null && <AuthPage />}
    </>
  );
}
export default User;
