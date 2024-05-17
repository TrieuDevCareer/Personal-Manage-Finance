import React, { useState, useContext, useEffect } from "react";
import MultiDropdown from "../../misc/multiDropdown";
import TableReport from "../../misc/tableReport";
import AreaChartType from "../../misc/charts/areaChart";
import UserContext from "../../../context/UserContext.js";
import "./expenseReport.scss";

function ExpenseReport() {
  const date = [];
  const month = [];
  const captitalSource = ["SO - Sống", "TD - Tự do"];
  for (let i = 0; i <= 30; i++) {
    date.push(i + 1);
    if (i < 12) {
      month.push(i + 1);
    }
  }
  return (
    <div className="expenseRp-container">
      <div className="expenseRp-ctrl-gr">
        <div className="expenseRp-title">Bảng điều khiển chọn lọc</div>
        <div className="expenseRp-filter-group">
          <MultiDropdown data={date} title={"Ngày"} />
          <MultiDropdown data={month} title={"Tháng"} />
          <MultiDropdown data={captitalSource} title={"Quỹ - Tài khoản"} />
          <MultiDropdown data={date} title={"Danh mục chi"} />
        </div>
      </div>
      <div className="expenseRp-root">
        <div className="expenseRp-table">
          <div className="expenseRp-title">Bảng thống kê Thu - Chi qua các tháng</div>
          <TableReport />
        </div>
        <div className="expenseRp-chart-container">
          <div className="expenseRp-title">Biểu đồ thể hiện các khoản chi</div>
          <div className="expenseRp-chart">
            <AreaChartType />
          </div>
        </div>
      </div>
    </div>
  );
}
export default ExpenseReport;
