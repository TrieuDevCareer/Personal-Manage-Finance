import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MultiDropdown from "../../misc/multiDropdown";
import TableReport from "../../misc/tableReport";
import LoadingProgess from "../../misc/loadingProgess.js";
import AreaChartType from "../../misc/charts/areaChart";
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
  const [message, setMessage] = useState("");

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
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
      {user && !expenseReportData && <LoadingProgess />}
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
              <div className="expenseRp-title">Bảng thống kê Thu - Chi qua các tháng</div>
              <TableReport />
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
