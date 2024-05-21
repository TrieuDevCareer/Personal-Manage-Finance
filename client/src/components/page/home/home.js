import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import TableReport from "../../misc/tableReport.js";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { Stack, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useNavigate } from "react-router-dom";
import "./home.scss";

const data = [{ label: "Không có dữ liệu", value: 0, color: "#0088FE" }];

function Home() {
  const [userData, setUserData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  function getArcLabel(params) {
    const TOTAL =
      pieChartData.length > 0
        ? pieChartData.map((item) => item.value).reduce((a, b) => a + b, 0)
        : data.map((item) => item.value).reduce((a, b) => a + b, 0);
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  }
  async function handleGetExpenseReport() {
    const result = await Axios.post(`${domain}/expense/reportexpense`, {
      month: `${new Date().getMonth() + 1}`,
    });
    setPieChartData(result.data.pieChartData);
  }
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
    else {
      getUserData();
      handleGetExpenseReport();
    }
  }, [user]);
  return (
    <div>
      {user && (
        <div className="home-container">
          <div className="top-left-container">
            <div className="title-container top-left">Số tiền mặt còn lại trong Ví</div>
            <div className="box">
              <div className="box-SO-container">
                <div className="title">Tài khoản ví Sống</div>
                <div className="money">{userData.walletLife}</div>
                <div className="bank">Vietinbank: 0779901726</div>
              </div>
              <div className="box-TK-container">
                <div className="title">Tài khoản ví Tiết kiệm</div>
                <div className="money">{userData.walletSaving}</div>
                <div className="bank">Vietinbank: 0779901726</div>
              </div>
              <div className="box-DT-container">
                <div className="title">Tài khoản ví Đầu tư</div>
                <div className="money">{userData.walletInvest}</div>
                <div className="bank">Vietinbank: 0779901726</div>
              </div>
              <div className="box-TD-container">
                <div className="title">Tài khoản ví Tự do</div>
                <div className="money">{userData.walletFree}</div>
                <div className="bank">Vietinbank: 0779901726</div>
              </div>
            </div>
          </div>
          <div className="top-right-container">
            <div className="title-container top-left">
              Phần trăm phân bổ theo danh mục Chi tháng {new Date().getMonth() + 1}
            </div>
            <div className="distance-box"></div>
            {pieChartData.length > 0 ? (
              <PieChart
                className="pieChart"
                series={[
                  {
                    data: pieChartData,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                    innerRadius: 30,
                    outerRadius: 95,
                    paddingAngle: 2,
                    cornerRadius: 3,
                    startAngle: -180,
                    endAngle: 180,
                    cx: 170,
                    cy: 100,
                    arcLabel: getArcLabel,
                  },
                ]}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: "white",
                    fontSize: 14,
                  },
                }}
              />
            ) : (
              <PieChart
                className="pieChart"
                series={[
                  {
                    data,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                    innerRadius: 30,
                    outerRadius: 95,
                    paddingAngle: 2,
                    cornerRadius: 3,
                    startAngle: -180,
                    endAngle: 180,
                    cx: 170,
                    cy: 100,
                    arcLabel: getArcLabel,
                  },
                ]}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: "white",
                    fontSize: 14,
                  },
                }}
              />
            )}
          </div>
          <div className="bottom-left-container">
            <div className="title-container top-left">Bảng thống kê Thu - Chi qua các tháng</div>
            <div className="distance-box"></div>
            <TableReport page={"home"} />
          </div>
          <div className="bottom-right-container">
            <div className="tk-report-container">
              <div className="title-container top-left">Tổng quan tài khoản gửi tiết kiệm</div>
              <div className="distance-box"></div>
              <div className="box">
                <div className="first-box item-box">
                  <div className="icon-container">
                    <AccountBalanceIcon className="icon" />
                  </div>
                  <div className="box-title">
                    <div className="money-title">Tổng số tiền nếu rút hết TKTK</div>
                    <div className="money-value">20.000.000 VND</div>
                  </div>
                </div>
                <div className="second-box item-box">
                  <div className="icon-container">
                    <AccountBalanceIcon className="icon" />
                  </div>
                  <div className="box-title">
                    <div className="money-title">Tổng số tiền chưa gửi tiết kiệm</div>
                    <div className="money-value">20.000.000 VND</div>
                  </div>
                </div>
                <div className="third-box item-box">
                  <div className="icon-container">
                    <AccountBalanceIcon className="icon" />
                  </div>
                  <div className="box-title">
                    <div className="money-title">Tổng số tiền đang gửi tiết kiệm</div>
                    <div className="money-value">20.000.000 VND</div>
                  </div>
                </div>
                <div className="forth-box item-box">
                  <div className="icon-container">
                    <AccountBalanceIcon className="icon" />
                  </div>
                  <div className="box-title">
                    <div className="money-title">Tổng số tiền lãi có thể nhận được</div>
                    <div className="money-value">20.000.000 VND</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dt-report-container">
              <div className="title-container top-left">Tổng quan tài khoản đầu tư</div>
              <div className="box-TD-root">
                <div className="box-item">
                  <div className="title">Số tiền đầu tư có thể có</div>
                  <div className="money">{userData.walletLife}</div>
                </div>
                <div className="second-gr-box">
                  <div className="box-item box-item-first">
                    <div className="title">Tổng số tiền chưa đem đi</div>
                    <div className="money">{userData.walletLife}</div>
                  </div>
                  <div className="box-item  box-item-second">
                    <div className="title">Tổng số tiền có thể lãi lỗ</div>
                    <div className="money">{userData.walletLife}</div>
                  </div>
                </div>
              </div>
              <img className="bg-box" src={"/images/investbg.png"} alt="..." />
            </div>
          </div>
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
