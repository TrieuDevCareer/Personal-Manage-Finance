import React from "react";
// import "./ErrorMessage.scss";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../misc/table.js";
import "./catalog.scss";

function Catalog({ isCheck, setIsCheck }) {
  const aTitleIncome = ["DANH MỤC THU", "MÃ"];
  const aTitleExpense = ["DANH MỤC CHI", "MÃ"];
  const aTitleInvest = ["DANH MỤC COIN"];
  const aTitleSaving = ["DANH MỤC BANK"];
  const aTitleInvestSta = ["TRẠNG THÁI COIN"];
  const aTitleSavingSta = ["TRẠNG THÁI BANK"];
  const aTitleLink = ["DANH MỤC LINK"];
  const aKeyItem = ["stt", "incDate", "dicLstContent"];
  const oDataIncome = [
    {
      income: "Lương",
      code: "SO",
    },
    {
      income: "Lương",
      code: "SO",
    },
    {
      income: "Lương",
      code: "SO",
    },
    {
      income: "Lương",
      code: "SO",
    },
    {
      income: "Lương",
      code: "SO",
    },
    {
      income: "Lương",
      code: "SO",
    },
    {
      income: "Lương",
      code: "SO",
    },
    {
      income: "Lương",
      code: "SO",
    },
    {
      income: "Lương",
      code: "SO",
    },
    {
      income: "Lương",
      code: "SO",
    },
    {
      income: "Lương",
      code: "SO",
    },
    {
      income: "Lương",
      code: "SO",
    },
  ];
  const oDataGenerate = [
    {
      generate: "VIETINBANk",
    },
    {
      generate: "VIETINBANk",
    },
    {
      generate: "VIETINBANk",
    },
    {
      generate: "VIETINBANk",
    },
    {
      generate: "VIETINBANk",
    },
    {
      generate: "VIETINBANk",
    },
    {
      generate: "VIETINBANk",
    },
    {
      generate: "VIETINBANk",
    },
  ];
  const oRouter = {
    router: "income",
    name: "Bảng thu nhập",
  };
  return (
    <div className="catalog-container">
      <div className="title-catalog">DANH MỤC</div>
      <div className="catalog-table-container">
        <div className="catalog-income">
          <Table
            oData={oDataIncome}
            aKeyItem={aKeyItem}
            aTitle={aKeyItem}
            rowsPerPage={10}
            isCheck={isCheck}
            setIsCheck={setIsCheck}
            // editModel={editIncome}
            oRouter={oRouter}
            colorTitle={"#f87c8b"}
          />
        </div>
        {/* <div className="catalog-expense">
          <Table
            oData={oDataIncome}
            aTitle={aTitleExpense}
            rowsPerPage={11}
            isCheck={isCheck}
            setIsCheck={setIsCheck}
            colorTitle={"#0ecb74"}
          />
        </div>
        <div className="catalog-group">
          <div className="catalog-frs-group">
            <div className="catalog-saving">
              <Table
                oData={oDataGenerate}
                aTitle={aTitleSaving}
                rowsPerPage={3}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                colorTitle={"#21a0ff"}
              />
            </div>
            <div className="catalog-invest">
              <Table
                oData={oDataGenerate}
                aTitle={aTitleInvest}
                rowsPerPage={3}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                colorTitle={"#ffd966"}
              />
            </div>
          </div>
          <div className="catalog-snd-group">
            <div className="catalog-status-saving">
              <Table
                oData={oDataGenerate}
                aTitle={aTitleSavingSta}
                rowsPerPage={2}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                colorTitle={"#21a0ff"}
              />
            </div>
            <div className="catalog-status-invest">
              <Table
                oData={oDataGenerate}
                aTitle={aTitleInvestSta}
                rowsPerPage={2}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                colorTitle={"#ffd966"}
              />
            </div>
          </div>
          <div className="catalog-link">
            <div className="catalog-link-style">
              <Table
                oData={oDataGenerate}
                aTitle={aTitleLink}
                rowsPerPage={3}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                colorTitle={"#70ad47"}
              />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Catalog;
