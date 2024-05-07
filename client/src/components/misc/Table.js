import React, { useState, useEffect } from "react";
import "./table.scss";

function Table({ oData, aTitle, colorTitle }) {
  function renderHeaderTable() {
    return aTitle.map((titleItem, i) => {
      return (
        <th className={"table-title"} style={{ backgroundColor: colorTitle }}>
          {titleItem}
        </th>
      );
    });
  }
  function renderDataTable() {
    let sortedItem = [...oData];
    // sortedItem = sortedItem.sort((a, b) => {
    //   return new Date(b.createdAt) - new Date(a.createdAt);
    // });
    return sortedItem.map((item, i) => {
      item = Object.assign({ stt: i + 1 }, item);
      let aValue = Object.values(item);
      return (
        <tr className="table-Item" key={i}>
          {aValue.map((value) => {
            return <td className="item-value">{value}</td>;
          })}
        </tr>
      );
    });
  }
  return (
    <div className="table-root">
      <table className="table-container">
        <tr className="table-header">
          <th className="table-title stt-style" style={{ backgroundColor: colorTitle }}>
            STT
          </th>
          {renderHeaderTable()}
        </tr>
        {oData.length > 0 ? renderDataTable() : <span>Không có dữ liệu để hiện thị</span>}
      </table>
    </div>
  );
}
export default Table;
