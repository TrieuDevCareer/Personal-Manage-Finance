import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import MultiDropdown from "../../misc/multiDropdown.js";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import SavingsIcon from "@mui/icons-material/Savings";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import AreaChartType from "../../misc/charts/areaChart.js";
import LoadingProgess from "../../misc/loadingProgess.js";
import AuthPage from "../../auth/authPage.js";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import "./investReport.scss";

const data = [{ label: "Không có dữ liệu", value: 1, color: "#0088FE" }];

function InvestReport() {
  const [investReportData, setInvestReportData] = useState();
  const [pieChartData, setPieChartData] = useState([]);
  const [dateCondition, setDateCondition] = useState([]);
  const [monthCodition, setMonthCondition] = useState([]);
  const [coinCondition, setCoinCondition] = useState([]);
  const [coinData, setCoinData] = useState([]);
  const [statusCondition, setStatusCondition] = useState([]);
  const [investReportTotal, setInvestReportTotal] = useState();
  const [message, setMessage] = useState("");

  const { user } = useContext(UserContext);

  const date = [];
  const month = [];
  const statusSource = ["Đang giữ", "Đã bán"];
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
  async function handleChangeCoin(event) {
    const {
      target: { value },
    } = event;
    setCoinCondition(typeof value === "string" ? value.split(",") : value);
    setStatusCondition([]);
  }
  function handleChangeStatus(event) {
    const {
      target: { value },
    } = event;
    setStatusCondition(typeof value === "string" ? value.split(",") : value);
  }
  async function handleGetDataContent(data) {
    try {
      const result = await Axios.get(`${domain}/coinlist`);
      let a = [];
      result.data.forEach((i) => {
        a.push(`${i.coinName}`);
      });
      setCoinData(a);
    } catch (err) {
      if (err.response) {
        if (err.response.data.errorMessage) {
          setMessage(err.response.data.errorMessage);
        }
      }
      return;
    }
  }
  async function handleGetInvestReportTotal() {
    const resultData = await Axios.get(`${domain}/investment/reporttotaldata`);
    setInvestReportTotal(resultData.data);
  }
  async function handleGetInvestReport() {
    const result = await Axios.post(`${domain}/investment/reportinvest`, {
      date: dateCondition,
      month: monthCodition,
      bank: coinCondition,
      status: statusCondition,
    });
    setInvestReportData(result.data.resultData);
    setPieChartData(result.data.pieResultData);
  }
  useEffect(() => {
    if (!user) setCoinData([]);
    else {
      handleGetDataContent();
      handleGetInvestReport();
      handleGetInvestReportTotal();
    }
  }, [user]);
  return (
    <div>
      {user && !coinData && !investReportTotal && !investReportData && !pieChartData && (
        <LoadingProgess />
      )}
      {user && coinData && investReportTotal && investReportData && pieChartData && (
        <div className="investRp-container">
          <div className="investRp-ctrl-gr">
            <div className="title-container investRp-title"> Bảng điều khiển chọn lọc</div>
            <div className="investRp-filter-group">
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
                personName={coinCondition}
                data={coinData}
                title={"Mã Coin"}
                handleChange={handleChangeCoin}
              />
              <MultiDropdown
                personName={statusCondition}
                data={statusSource}
                title={"Tình trạng gửi"}
                handleChange={handleChangeStatus}
              />
              <div className="btn-style-edit" onClick={handleGetInvestReport}>
                <SearchOutlinedIcon /> Thống kê
              </div>
            </div>
          </div>
          <div className="investRp-root">
            <div className="investRp-left-container">
              <div className="investRp-left-top">
                <div className="title-container top-left">Số tiền mặt còn lại trong Ví</div>
                <div className="box">
                  <div className="first-box item-box">
                    <div className="icon-container">
                      <AccountBalanceIcon className="icon" />
                    </div>
                    <div className="box-title">
                      <div className="money-title">Số tiền đầu tư có thể có</div>
                      <div className="money-value">{investReportTotal.investmentAmount}</div>
                    </div>
                  </div>
                  <div className="second-box item-box">
                    <div className="icon-container">
                      <PaidOutlinedIcon className="icon" />
                    </div>
                    <div className="box-title">
                      <div className="money-title">Tổng số tiền chưa đem đi</div>
                      <div className="money-value">{investReportTotal.nonInvestAmount}</div>
                    </div>
                  </div>
                  <div className="third-box item-box">
                    <div className="icon-container">
                      <SavingsIcon className="icon" />
                    </div>
                    <div className="box-title">
                      <div className="money-title">Tổng số tiền có thể lãi lỗ</div>
                      <div className="money-value">{investReportTotal.profitAmount}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="investRp-left-bottom">
                <div className="title-container top-left">
                  Biểu đồ % nắm giữ đồng COIN theo số tiền
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
            <div className="investRp-right-container">
              <div className="title-container top-left">
                Bảng thống kê số tiền đầu tư vào các đồng COIN
              </div>
              <div className="investRp-chart">
                <div className="investRp-chart-element">
                  {investReportData ? (
                    <AreaChartType data={investReportData} pageChart={"invest"} />
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
export default InvestReport;
