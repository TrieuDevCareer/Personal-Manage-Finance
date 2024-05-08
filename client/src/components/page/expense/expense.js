import React from "react";
// import "./ErrorMessage.scss";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../misc/table.js";
import "./expense.scss";

function Expense() {
  const aTitle = ["NGÀY THÁNG", "DANH MỤC CHI", " QUỸ-TÀI KHOẢN", "NỘI DUNG CHI", "SỐ TIỀN CHI"];
  let x = 35000;
  const oData = [
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng111",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO111",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      date: "07/5/2024",
      listIncome: "SO-Lương",
      typeIncome: "SO",
      content: "Ăn sáng",
      Money: x.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
  ];
  return (
    <div className="expense-container">
      <div className="title-expense">DANH SÁCH CÁC KHOẢN CHI</div>
      <Table oData={oData} aTitle={aTitle} rowsPerPage={14} colorTitle={"#ff007f"} />
    </div>
  );
}

export default Expense;
