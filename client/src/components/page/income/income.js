import React from "react";
// import "./ErrorMessage.scss";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../misc/table.js";
import "./income.scss";

function Income() {
  const aTitle = ["NGÀY THÁNG", "DANH MỤC THU", " QUỸ-TÀI KHOẢN", "NỘI DUNG THU", "SỐ TIỀN THU"];
  let x = 35000;
  const oData = [
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
  ];
  return (
    <div className="income-container">
      <div className="title-income">DANH SÁCH CÁC KHOẢN THU</div>
      <div>
        <Table oData={oData} aTitle={aTitle} rowsPerPage={14} colorTitle={"#0ecb74"} />
      </div>
    </div>
  );
}

export default Income;
