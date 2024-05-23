import React, { useState, useContext, useEffect } from "react";

function SavingReport() {
  return (
    <div className="savingRp-container">
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
      <div>
        <div>
          <div></div>
          <div></div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
export default SavingReport;
