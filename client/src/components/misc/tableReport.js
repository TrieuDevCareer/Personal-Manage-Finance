import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import UserContext from "../../context/UserContext";
import domain from "../../util/domain.js";
import "./tableReport.scss";

function TableReport() {
  const [resultData, setResultData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalDifferent, setTotalDifferent] = useState(0);
  const { user } = useContext(UserContext);
  function renderItem() {
    return resultData.map((item, i) => {
      return (
        <tr key={i}>
          <td>{i + 1}</td>
          <td className="item-table-income">{item.incomeSite}</td>
          <td className="item-table-expense">{item.expenseSite}</td>
          <td className="item-table-different">{item.different}</td>
        </tr>
      );
    });
  }
  async function getResultData() {
    let totalIncome = 0;
    let totalExpense = 0;
    const result = await Axios.get(`${domain}/income/reporttotal`);
    result.data.map((i) => {
      totalIncome += i.incomeSite;
      totalExpense += i.expenseSite;
      i.different =
        i.incomeSite - i.expenseSite !== 0
          ? (i.incomeSite - i.expenseSite).toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })
          : "-";
      i.incomeSite =
        i.incomeSite !== 0
          ? i.incomeSite.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })
          : "-";
      i.expenseSite =
        i.expenseSite !== 0
          ? i.expenseSite.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })
          : "-";
      return i.incomeSite, i.expenseSite, i.different;
    });
    setResultData(result.data);
    setTotalDifferent(
      totalIncome - totalExpense !== 0
        ? (totalIncome - totalExpense).toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })
        : "-"
    );
    setTotalIncome(
      totalIncome !== 0
        ? totalIncome.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })
        : "-"
    );
    setTotalExpense(
      totalExpense !== 0
        ? totalExpense.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })
        : "-"
    );
  }
  useEffect(() => {
    if (!user) setResultData([]);
    else getResultData();
  }, [user]);
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
          <td>{totalIncome}</td>
          <td>{totalExpense}</td>
          <td>{totalDifferent}</td>
        </tr>
      </tfoot>
    </table>
  );
}
export default TableReport;
