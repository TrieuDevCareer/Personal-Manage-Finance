import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import MultiDropdown from "../../misc/multiDropdown";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import SavingsIcon from "@mui/icons-material/Savings";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import AuthPage from "../../auth/authPage.js";
import LoadingProgess from "../../misc/loadingProgess.js";
import AreaChartType from "../../misc/charts/areaChart";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import "./savingReport.scss";
const data = [{ label: "Không có dữ liệu", value: 1, color: "#0088FE" }];

function SavingReport() {
  const [savingReportData, setSavingReportData] = useState();
  const [savingReportTotal, setSavingReportTotal] = useState();
  const [pieChartData, setPieChartData] = useState();
  const [dateCondition, setDateCondition] = useState([]);
  const [monthCodition, setMonthCondition] = useState([]);
  const [bankCondition, setBankCondition] = useState([]);
  const [bankData, setBankData] = useState();
  const [statusCondition, setStatusCondition] = useState([]);
  const [message, setMessage] = useState("");

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const date = [];
  const month = [];
  const statusSource = ["Đang gửi tiết kiệm", "Đã rút tiết kiệm"];
  for (let i = 0; i <= 30; i++) {
    date.push(i < 9 ? `0${i + 1}` : `${i + 1}`);
    if (i < 12) {
      month.push(`${i + 1}`);
    }
  }
  function getArcLabel(params) {
    const TOTAL =
      pieChartData.length > 0
        ? pieChartData.map((item) => item.value).reduce((a, b) => a + b, 0)
        : data.map((item) => item.value).reduce((a, b) => a + b, 0);
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
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
  async function handleChangeBank(event) {
    const {
      target: { value },
    } = event;
    setBankCondition(typeof value === "string" ? value.split(",") : value);
    setStatusCondition([]);
  }
  function handleChangeStatus(event) {
    const {
      target: { value },
    } = event;
    setStatusCondition(typeof value === "string" ? value.split(",") : value);
  }
  async function handleGetDataContent() {
    try {
      const result = await Axios.get(`${domain}/banklist`);
      let a = [];
      result.data.forEach((i) => {
        a.push(`${i.bnkName}`);
      });
      setBankData(a);
    } catch (err) {
      if (err.response) {
        if (err.response.data.errorMessage) {
          setMessage(err.response.data.errorMessage);
        }
      }
      return;
    }
  }
  async function handleGetSavingReport() {
    const result = await Axios.post(`${domain}/saving/reportsaving`, {
      date: dateCondition,
      month: monthCodition,
      bank: bankCondition,
      status: statusCondition,
    });
    setSavingReportData(result.data.resultData);
    setPieChartData(result.data.pieResultData);
  }
  async function handleGetSavingReportTotal() {
    const resultData = await Axios.get(`${domain}/saving/reporttotaldata`);
    setSavingReportTotal(resultData.data);
  }
  useEffect(() => {
    if (!user) setBankData([]);
    else {
      handleGetDataContent();
      handleGetSavingReport();
      handleGetSavingReportTotal();
    }
  }, [user]);
  return (
    <div>
      {user && !savingReportData && !savingReportTotal && !pieChartData && !bankData && (
        <LoadingProgess />
      )}
      {user && savingReportData && savingReportTotal && pieChartData && bankData && (
        <div className="savingRp-container">
          <div className="savingRp-ctrl-gr">
            <div className="title-container savingRp-title">Bảng điều khiển chọn lọc</div>
            <div className="savingRp-filter-group">
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
                personName={bankCondition}
                data={bankData}
                title={"Ngân hàng"}
                handleChange={handleChangeBank}
              />
              <MultiDropdown
                personName={statusCondition}
                data={statusSource}
                title={"Tình trạng gửi"}
                handleChange={handleChangeStatus}
              />
              <div className="btn-style-edit" onClick={handleGetSavingReport}>
                <SearchOutlinedIcon /> Thống kê
              </div>
            </div>
          </div>
          <div className="savingRp-root">
            <div className="savingRp-left-container">
              <div className="savingRp-left-top">
                <div className="title-container top-left">Thống kê tổng quan tiết kiệm</div>
                <div className="box">
                  <div className="first-box item-box">
                    <div className="icon-container">
                      <AccountBalanceIcon className="icon" />
                    </div>
                    <div className="box-title">
                      <div className="money-title">
                        Tổng số tiền nếu rút hết Tài Khoản Tiết Kiệm
                      </div>
                      <div className="money-value">{savingReportTotal.iReportTotalMon}</div>
                    </div>
                  </div>
                  <div className="second-box item-box">
                    <div className="icon-container">
                      <PaidOutlinedIcon className="icon" />
                    </div>
                    <div className="box-title">
                      <div className="money-title">Tổng số tiền chưa gửi Tiết Kiệm</div>
                      <div className="money-value">{savingReportTotal.iUnsavedAmount}</div>
                    </div>
                  </div>
                  <div className="third-box item-box">
                    <div className="icon-container">
                      <SavingsIcon className="icon" />
                    </div>
                    <div className="box-title">
                      <div className="money-title">Tổng số tiền đang gửi Tiết Kiệm</div>
                      <div className="money-value">{savingReportTotal.iSavingAmount}</div>
                    </div>
                  </div>
                  <div className="forth-box item-box">
                    <div className="icon-container">
                      <AddShoppingCartIcon className="icon" />
                    </div>
                    <div className="box-title">
                      <div className="money-title">Tổng số tiền lãi có thể nhận được</div>
                      <div className="money-value">{savingReportTotal.iAmountOfInterest}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="savingRp-left-bottom">
                <div className="title-container top-left">
                  Biểu đồ % gửi tiết kiệm vào các ngân hàng
                </div>
                <PieChart
                  className="pieChart"
                  series={[
                    {
                      data: pieChartData.length > 0 ? pieChartData : data,
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                      innerRadius: 30,
                      outerRadius: 100,
                      paddingAngle: 1.5,
                      cornerRadius: 2,
                      startAngle: -180,
                      endAngle: 180,
                      cx: 103,
                      cy: 120,
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
              </div>
            </div>
            <div className="savingRp-right-container">
              <div className="title-container top-left">
                Biểu đồ thể hiện các khoản GTK theo ngân hàng
              </div>
              <div className="savingRp-chart">
                <div className="savingRp-chart-element">
                  {savingReportData ? (
                    <AreaChartType data={savingReportData} pageChart={"saving"} />
                  ) : (
                    <AreaChartType data={[]} pageChart={"saving"} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {user === null && <AuthPage />}
    </div>
  );
}
export default SavingReport;
