import React, { useState } from "react";
// import "./ErrorMessage.scss";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../misc/table.js";
import IncomeEditor from "./incomeEditor.js";
import "./income.scss";

function Income({ isCheck, setIsCheck }) {
  const [incomeEditorOpen, setIncomeEditorOpen] = useState(false);
  const [editIncomeData, setEditIncomeData] = useState(null);

  const aTitle = ["NGÀY THÁNG", "DANH MỤC THU", " QUỸ-TÀI KHOẢN", "NỘI DUNG THU", "SỐ TIỀN THU"];
  let x = 35000;
  let today = "05/10/2024";
  today = Date.parse(today);
  const defaultValue = new Date(today).toISOString().split("T")[0];
  console.log(defaultValue);
  const oData = [
    {
      incDate: defaultValue,
      dicLstContent: "SO-Lương",
      dicLstCode: "SO",
      incDetail: "Ăn sáng",
      incMoney: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
  ];

  function editIncome(incomeData) {
    console.log(incomeData);
    setEditIncomeData(incomeData);
    setIncomeEditorOpen(true);
  }
  return (
    <div className="income-container">
      <div className="title-income">DANH SÁCH CÁC KHOẢN THU</div>

      {incomeEditorOpen ? (
        <IncomeEditor setIncomeEditorOpen={setIncomeEditorOpen} editIncomeData={editIncomeData} />
      ) : (
        <div>
          <Table
            oData={oData}
            aTitle={aTitle}
            rowsPerPage={10}
            isCheck={isCheck}
            setIsCheck={setIsCheck}
            editIncome={editIncome}
            colorTitle={"#0ecb74"}
          />
        </div>
      )}
    </div>
  );
}

export default Income;
