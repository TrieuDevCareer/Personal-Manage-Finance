import React, { useState, useContext, useEffect } from "react";
import MultiDropdown from "../../misc/multiDropdown";
import TableReport from "../../misc/tableReport";
import AreaChartType from "../../misc/charts/areaChart";
import "./expenseReport.scss";

function ExpenseReport() {
  const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
  ];
  return (
    <div className="expenseRp-container">
      <div className="expenseRp-ctrl-gr">
        <div className="expenseRp-title">Bảng điều khiển chọn lọc</div>
        <div className="expenseRp-filter-group">
          <MultiDropdown data={names} title={"Ngày"} />
          <MultiDropdown data={names} title={"Tháng"} />
          <MultiDropdown data={names} title={"Quỹ - Tài khoản"} />
          <MultiDropdown data={names} title={"Danh mục chi"} />
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
