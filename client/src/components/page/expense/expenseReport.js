import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MultiDropdown from "../../misc/multiDropdown";
import TableReport from "../../misc/tableReport";
import LoadingProgess from "../../misc/loadingProgess.js";
import AreaChartType from "../../misc/charts/areaChart";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import SavingsIcon from "@mui/icons-material/Savings";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AuthPage from "../../auth/authPage.js";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import ErrorMessage from "../../misc/ErrorMessage";
import "./expenseReport.scss";

function ExpenseReport() {
  const [expenseReportData, setExpenseReportData] = useState();
  const [dateCondition, setDateCondition] = useState([]);
  const [monthCodition, setMonthCondition] = useState([]);
  const [capitalCondition, setCapitalCondition] = useState([]);
  const [contentCondition, setContentCondition] = useState([]);
  const [contentData, setContentData] = useState([]);
  const [resultByDay, setResultByDay] = useState([]);
  const [message, setMessage] = useState("");

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  var d = new Date();

  const date = [];
  const month = [];
  const captitalSource = ["SO", "TD"];
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
    try {
      const result = await Axios.post(`${domain}/expenselist/content`, { data: data });
      let a = [];
      result.data.forEach((i) => {
        a.push(`${i.exelstCode}-${i.exeLstContent}`);
      });
      setContentData(a);
    } catch (err) {
      if (err.response) {
        if (err.response.data.errorMessage) {
          setMessage(err.response.data.errorMessage);
        }
      }
      return;
    }
  }
  async function handleGetExpenseReport() {
    const result = await Axios.post(`${domain}/expense/reportexpense`, {
      date: dateCondition,
      month: monthCodition,
      capitalSource: capitalCondition,
      contentData: contentCondition,
    });
    const resultDay = await Axios.get(`${domain}/expense/byday`);
    setResultByDay(resultDay.data);
    setExpenseReportData(result.data.resultData);
  }
  useEffect(() => {
    if (!user) setContentData([]);
    else {
      const data = ["All"];
      handleGetDataContent(data);
      handleGetExpenseReport();
    }
  }, [user]);
  return (
    <div>
      {user && !expenseReportData && !resultByDay && <LoadingProgess />}
      {user && expenseReportData && (
        <div className="expenseRp-container">
          <ErrorMessage message={message} setMessage={setMessage} />

          <div className="expenseRp-ctrl-gr">
            <div className="expenseRp-title">Bảng điều khiển chọn lọc</div>
            <div className="expenseRp-filter-group">
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
              <div className="btn-style-edit" onClick={handleGetExpenseReport}>
                <SearchOutlinedIcon /> Thống kê
              </div>
            </div>
          </div>
          <div className="expenseRp-root">
            <div className="expenseRp-table">
              <div className="expenseRp-title">
                Bảng thống kê Chi trong ngày hôm nay {d.getDate()}/{d.getMonth() + 1}/
                {d.getFullYear()}
              </div>
              <div className="box">
                <div className="first-box item-box">
                  <div className="icon-container">
                    <AccountBalanceIcon className="icon" />
                  </div>
                  <div className="box-title">
                    <div className="money-title">Số tiền nguồn Sống được Chi trong ngày</div>
                    <div className="money-value">{resultByDay.SoDay}</div>
                  </div>
                </div>
                <div className="second-box item-box">
                  <div className="icon-container">
                    <PaidOutlinedIcon className="icon" />
                  </div>
                  <div className="box-title">
                    <div className="money-title">Số tiền nguồn Tự do được Chi trong ngày</div>
                    <div className="money-value">{resultByDay.TdDay}</div>
                  </div>
                </div>
                <div className="third-box item-box">
                  <div className="icon-container">
                    <SavingsIcon className="icon" />
                  </div>
                  <div className="box-title">
                    <div className="money-title">Số tiền Sống thực tế Chi trong ngày</div>
                    <div className="money-value">{resultByDay.SO}</div>
                  </div>
                </div>
                <div className="forth-box item-box">
                  <div className="icon-container">
                    <AddShoppingCartIcon className="icon" />
                  </div>
                  <div className="box-title">
                    <div className="money-title">Số tiền Tự do thực tế Chi trong ngày</div>
                    <div className="money-value">{resultByDay.TD}</div>
                  </div>
                </div>
                <div className="fifth-box item-box">
                  <div className="icon-container">
                    <AddShoppingCartIcon className="icon" />
                  </div>
                  <div className="box-title">
                    <div className="money-title">Tổng nguồn Sống còn lại trong Tháng</div>
                    <div className="money-value">{resultByDay.walletLife}</div>
                  </div>
                </div>
                <div className="sixth-box item-box">
                  <div className="icon-container">
                    <AddShoppingCartIcon className="icon" />
                  </div>
                  <div className="box-title">
                    <div className="money-title">Tổng nguồn Tự do còn lại trong Tháng</div>
                    <div className="money-value">{resultByDay.walletFree}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="expenseRp-chart-container">
              <div className="expenseRp-title">Biểu đồ thể hiện các khoản thu</div>
              <div className="expenseRp-chart">
                {expenseReportData && expenseReportData.length > 0 ? (
                  <div className="expenseRp-chart-element">
                    <AreaChartType data={expenseReportData} pageChart={"expense"} />
                  </div>
                ) : (
                  <div className="expenseRp-chart-element">
                    <AreaChartType data={[]} pageChart={"expense"} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {user === null && <AuthPage />}
    </div>
  );
}
export default ExpenseReport;
