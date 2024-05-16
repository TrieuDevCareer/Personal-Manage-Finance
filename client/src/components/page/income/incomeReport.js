import React, { useState, useContext, useEffect } from "react";
import MultiDropdown from "../../misc/multiDropdown";
import TableReport from "../../misc/tableReport";
import AreaChartType from "../../misc/charts/areaChart";
import "./incomeReport.scss";

function IncomeReport() {
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
    <div className="incomeRp-container">
      <div className="incomeRp-ctrl-gr">
        <div className="incomeRp-title">Bảng điều khiển chọn lọc</div>
        <div className="incomeRp-filter-group">
          <MultiDropdown data={names} title={"Ngày"} />
          <MultiDropdown data={names} title={"Tháng"} />
          <MultiDropdown data={names} title={"Quỹ - Tài khoản"} />
          <MultiDropdown data={names} title={"Danh mục thu"} />
        </div>
      </div>
      <div className="incomeRp-root">
        <div className="incomeRp-table">
          <div className="incomeRp-title">Bảng thống kê Thu - Chi qua các tháng</div>
          <TableReport />
        </div>
        <div className="incomeRp-chart-container">
          <div className="incomeRp-title">Bảng thống kê Thu - Chi qua các tháng</div>
          <div className="incomeRp-chart">
            <AreaChartType />
          </div>
        </div>
      </div>
    </div>
  );
}
export default IncomeReport;
