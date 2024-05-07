import React from "react";
// import "./ErrorMessage.scss";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../misc/table.js";
import "./investment.scss";

function Investment() {
  const aTitle = [
    "NGÀY MUA",
    "MÃ COIN",
    "GIÁ $ LÚC MUA",
    "VNĐ MUA",
    "SỐ COIN",
    "USDT NHẬN",
    "TÌNH TRẠNG",
    "TRẠNG THÁI",
    "NGÀY BÁN",
    "GIÁ $ LÚC BÁN",
    "USDT LÚC BÁN",
    "VNĐ THU VỀ",
    "LÃI LỖ",
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
  ];
  return (
    <div className="invest-container">
      <div className="report-invest">
        <div className="report-item">
          <p>Số tiền đầu tư có thể có:</p>
          <span>xyz</span>
        </div>
        <div className="report-item">
          <p>Tổng số tiền chưa đem đi đầu tư:</p>
          <span>xyz</span>
        </div>
        <div className="report-item">
          <p>Tổng số tiền có thể lãi lỗ:</p>
          <span>xyz</span>
        </div>
      </div>
      <div className="title-invest">DANH SÁCH ĐẦU TƯ</div>
      <Table oData={oData} aTitle={aTitle} colorTitle={"#ff0000"} />
    </div>
  );
}

export default Investment;
