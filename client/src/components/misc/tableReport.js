import React, { useState, useContext, useEffect } from "react";
import "./tableReport.scss";

function TableReport() {
  let data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  function renderItem() {
    return data.map((item, i) => {
      return (
        <tr key={i}>
          <td>{item}</td>
          <td className="item-table-income">100.000.000.000 VND</td>
          <td className="item-table-expense">100.000.000.000 VND</td>
          <td className="item-table-different">10.000.000.000 VND</td>
        </tr>
      );
    });
  }
  return (
    <table className="table-report">
      <thead>
        <tr>
          <th className="table-month">Tháng</th>
          <th className="table-income">Thu</th>
          <th className="table-expense">Chi</th>
          <th className="table-different">Chênh lệch</th>
        </tr>
      </thead>
      <tbody>{renderItem()}</tbody>
      <tfoot>
        <tr>
          <td>TC</td>
          <td>1.000.000 VND</td>
          <td>-</td>
          <td>-</td>
        </tr>
      </tfoot>
    </table>
  );
}
export default TableReport;
