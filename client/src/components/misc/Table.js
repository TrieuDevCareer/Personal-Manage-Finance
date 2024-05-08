import React, { useState, useEffect } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./table.scss";

function Table({ oData, aTitle, rowsPerPage, colorTitle }) {
  const [page, setPage] = useState(0);
  const maxPage = Math.ceil(oData.length / rowsPerPage);
  const handleArrowBackPage = (event, newPage) => {
    setPage(newPage > 0 ? newPage - 1 : 0);
  };

  const handleArrowForwardPage = (event, newPage) => {
    setPage(newPage < maxPage ? newPage + 1 : maxPage);
  };
  const handleArrowBackMaxPage = (event) => {
    setPage(0);
  };

  const handleArrowForwardMaxPage = (event) => {
    setPage(maxPage);
  };

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
    sortedItem = sortedItem.map((item, i) => {
      return Object.assign({ stt: i + 1 }, item);
    });
    sortedItem =
      rowsPerPage > 0
        ? sortedItem.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : sortedItem;
    return sortedItem.map((item, i) => {
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
      <div className="foot-table" colspan="7">
        <ArrowBackIcon className="btn-style" onClick={() => handleArrowBackMaxPage()} />
        <ArrowBackIosIcon className="btn-style" onClick={() => handleArrowBackPage(Event, page)} />
        <ArrowForwardIosIcon
          className="btn-style"
          onClick={() => handleArrowForwardPage(Event, page)}
        />
        <ArrowForwardIcon className="btn-style" onClick={() => handleArrowForwardMaxPage()} />
      </div>
    </div>
  );
}
export default Table;
