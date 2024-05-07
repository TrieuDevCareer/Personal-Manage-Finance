import React from "react";
// import "./ErrorMessage.scss";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../misc/table.js";
import "./saving.scss";

function Saving() {
  const aTitle = [
    "NGÀY THÁNG",
    "DANH MỤC GTK",
    "SỐ TIỀN GỬI",
    "SỐ THÁNG GỬI",
    "LÃI/NĂM",
    "TỔNG LÃI NHẬN ĐƯỢC",
    "TỔNG SỐ TIỀN SAU KHI GỬI(GỒM CẢ LÃI)",
    "TRẠNG THÁI",
    "SỐ TIỀN THỰC TẾ NHẬN ĐƯỢC KHI RÚT",
    "SỐ TIỀN CHÊNH LỆCH SAU KHI RÚT",
  ];
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
    <div className="saving-container">
      <div className="report-saving">
        <div className="report-item">
          <p>Số tiền tiết kiệm ban đầu:</p>
          <span>xyz</span>
        </div>
        <div className="report-item">
          <p>Tổng số tiền nếu rút hết TKTK:</p>
          <span>xyz</span>
        </div>
        <div className="report-item">
          <p>Tổng số tiền chưa gửi tiết kiệm</p>
          <span>xyz</span>
        </div>
        <div className="report-item">
          <p>Tổng số tiền đang gửi tiết kiệm:</p>
          <span>xyz</span>
        </div>
        <div className="report-item">
          <p>Tổng số tiền lãi có thể nhận được :</p>
          <span>xyz</span>
        </div>
      </div>
      <div className="title-saving">DANH SÁCH GỬI TIẾT KIỆM</div>
      <Table oData={oData} aTitle={aTitle} colorTitle={"#0ecb74"} />
    </div>
  );
}

export default Saving;
