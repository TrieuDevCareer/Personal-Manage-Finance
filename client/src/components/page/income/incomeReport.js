import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { Stack, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MultiDropdown from "../../misc/multiDropdown";
import TableReport from "../../misc/tableReport";
import LoadingProgess from "../../misc/loadingProgess.js";
import AreaChartType from "../../misc/charts/areaChart";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import "./incomeReport.scss";

function IncomeReport() {
  const [incomeReportData, setIncomeReportData] = useState();
  const [dateCondition, setDateCondition] = useState([]);
  const [monthCodition, setMonthCondition] = useState([]);
  const [capitalCondition, setCapitalCondition] = useState([]);
  const [contentCondition, setContentCondition] = useState([]);
  const [contentData, setContentData] = useState([]);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const date = [];
  const month = [];
  const captitalSource = ["SO", "TK", "DT", "TD"];
  for (let i = 0; i <= 30; i++) {
    date.push(i < 9 ? `0${i + 1}` : `${i + 1}`);
    if (i < 12) {
      month.push(`${i + 1}`);
    }
  }

  function handleChangeDate(event) {
    const {
      target: { value },
    } = event;
    setDateCondition(typeof value === "string" ? value.split(",") : value);
  }
  function handleChangeMonth(event) {
    const {
      target: { value },
    } = event;
    setMonthCondition(typeof value === "string" ? value.split(",") : value);
  }
  async function handleChangeCapital(event) {
    const {
      target: { value },
    } = event;
    setCapitalCondition(typeof value === "string" ? value.split(",") : value);
    setContentCondition([]);
    handleGetDataContent(value);
  }
  function handleChangeContent(event) {
    const {
      target: { value },
    } = event;
    setContentCondition(typeof value === "string" ? value.split(",") : value);
  }
  async function handleGetDataContent(data) {
    const result = await Axios.post(`${domain}/incomelist/content`, {
      data: data.length > 0 ? data : ["All"],
    });
    let a = [];
    result.data.forEach((i) => {
      a.push(`${i.inlstCode}-${i.inLstContent}`);
    });
    setContentData(a);
  }
  async function handleGetIncomeReport() {
    const result = await Axios.post(`${domain}/income/reportincome`, {
      date: dateCondition,
      month: monthCodition,
      capitalSource: capitalCondition,
      contentData: contentCondition,
    });
    setIncomeReportData(result.data);
  }
  useEffect(() => {
    if (!user) setContentData([]);
    else {
      const data = ["All"];
      handleGetDataContent(data);
      handleGetIncomeReport();
    }
  }, [user]);
  return (
    <div>
      {user && !incomeReportData && <LoadingProgess />}
      {user && incomeReportData && (
        <div className="incomeRp-container">
          <div className="incomeRp-ctrl-gr">
            <div className="incomeRp-title">Bảng điều khiển chọn lọc</div>
            <div className="incomeRp-filter-group">
              <MultiDropdown
                personName={dateCondition}
                data={date}
                title={"Ngày"}
                handleChange={handleChangeDate}
              />
              <MultiDropdown
                personName={monthCodition}
                data={month}
                title={"Tháng"}
                handleChange={handleChangeMonth}
              />
              <MultiDropdown
                personName={capitalCondition}
                data={captitalSource}
                title={"Quỹ - Tài khoản"}
                handleChange={handleChangeCapital}
              />
              <MultiDropdown
                personName={contentCondition}
                data={contentData}
                title={"Danh mục thu"}
                handleChange={handleChangeContent}
              />
              <div className="btn-style-edit" onClick={handleGetIncomeReport}>
                <SearchOutlinedIcon /> Thống kê
              </div>
            </div>
          </div>
          <div className="incomeRp-root">
            <div className="incomeRp-table">
              <div className="incomeRp-title">Bảng thống kê Thu - Chi qua các tháng</div>
              <TableReport />
            </div>
            <div className="incomeRp-chart-container">
              <div className="incomeRp-title">Biểu đồ thể hiện các khoản thu</div>
              <div className="incomeRp-chart">
                {incomeReportData &&
                incomeReportData.resultData &&
                incomeReportData.resultData.length > 0 ? (
                  <div className="incomeRp-chart-element">
                    <AreaChartType
                      data={incomeReportData.resultData}
                      contentKey={"inLstContent"}
                      moneyKey={"incMoney"}
                      nameKey={"Nguồn sống"}
                      color={"#0ecb74"}
                    />
                  </div>
                ) : (
                  <div className="incomeRp-chart-element">
                    <AreaChartType data={[]} />
                  </div>
                )}
              </div>
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
export default IncomeReport;
