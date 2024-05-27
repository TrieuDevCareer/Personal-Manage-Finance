import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import domain from "../../util/domain";
import ErrorMessage from "./ErrorMessage";
import "./table.scss";

function Table({
  oData,
  aKeyItem,
  aTitle,
  rowsPerPage,
  isCheck,
  setIsCheck,
  editModel,
  oRouter,
  isCatalogPage,
  bStatus,
  colorTitle,
}) {
  const [page, setPage] = useState(0);
  const [chooseData, setChooseData] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const maxPage = Math.ceil(oData.length / rowsPerPage);
  const handleArrowBackPage = (_event, newPage) => {
    setPage(newPage > 0 ? newPage - 1 : 0);
  };

  const handleArrowForwardPage = (_event, newPage) => {
    setPage(newPage < maxPage ? newPage + 1 : maxPage);
  };
  const handleArrowBackMaxPage = () => {
    setPage(0);
  };

  const handleArrowForwardMaxPage = () => {
    setPage(maxPage);
  };

  function renderHeaderTable() {
    return aTitle.map((titleItem, i) => {
      return (
        <th className={"table-title"} style={{ backgroundColor: colorTitle }} key={i}>
          {titleItem}
        </th>
      );
    });
  }

  function renderDataTable() {
    let sortedItem = [...oData];
    sortedItem = sortedItem.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    sortedItem = sortedItem.map((item, i) => {
      return Object.assign({ stt: i + 1 }, item);
    });
    sortedItem =
      rowsPerPage > 0
        ? sortedItem.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : sortedItem;
    return sortedItem.map((item, i) => {
      const filteredObj = {};
      aKeyItem.forEach((key) => {
        if (bStatus && typeof item[key] === "boolean") {
          filteredObj[key] = item[key] === true ? bStatus.true : bStatus.false;
        } else {
          filteredObj[key] = item[key];
        }
      });
      return (
        <tr className="table-Item" key={i}>
          {!isCatalogPage && (
            <td className="item-value">
              <Checkbox
                value={JSON.stringify(item)}
                sx={{
                  color: "#ffffff",
                  "&.Mui-checked": {
                    color: "#00b0f0",
                  },
                }}
                onChange={handleChange}
              />
            </td>
          )}

          {aKeyItem.map((element, i) => {
            return (
              <td className="item-value" key={i}>
                <span>{filteredObj[element]}</span>
              </td>
            );
          })}
          {!isCatalogPage && (
            <td className="item-value">
              {bStatus &&
              (filteredObj["savStatus"] === "Đã rút" ||
                filteredObj["investStatus"] === "Đã rút") ? (
                <EditNoteIcon className="btn-style-edit-disable" />
              ) : (
                <EditNoteIcon className="btn-style-edit" onClick={() => editModel(item)} />
              )}
            </td>
          )}
        </tr>
      );
    });
  }

  function handleChange(event) {
    let aCurrentData = [];
    if (event.target.checked) {
      aCurrentData = chooseData;
      aCurrentData.push(JSON.parse(event.target.value));
      setIsCheck(true);
    } else {
      aCurrentData = chooseData.filter((item) => item.stt !== JSON.parse(event.target.value).stt);
      if (aCurrentData.length === 0) setIsCheck(false);
    }
    setChooseData(aCurrentData);
  }
  function deleteData() {
    try {
      if (window.confirm(`Bạn muốn xóa những các giá trị của ${oRouter.name} này?`)) {
        chooseData.forEach(async (data) => {
          await Axios.delete(`${domain}/${oRouter.router}/${data._id}`, { data: chooseData });
        });
        setIsCheck(false);
        setChooseData([]);
        navigate(0);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.data.errorMessage) {
          setMessage(err.response.data.errorMessage);
        }
      }
      return;
    }
  }
  useEffect(() => {}, [chooseData]);
  return (
    <div className="table-root">
      <ErrorMessage message={message} setMessage={setMessage} />
      <table className="table-container">
        <thead>
          <tr className="table-header">
            <th className="table-title stt-style" style={{ backgroundColor: colorTitle }}>
              CHỌN
            </th>
            {!isCatalogPage && (
              <th className="table-title stt-style" style={{ backgroundColor: colorTitle }}>
                STT
              </th>
            )}
            {renderHeaderTable()}
            {!isCatalogPage && (
              <th className="table-title edit-style" style={{ backgroundColor: colorTitle }}></th>
            )}
          </tr>
        </thead>
        <tbody> {oData.length > 0 ? renderDataTable() : ""}</tbody>
        <tfoot></tfoot>
      </table>
      {oData.length === 0 && <h2 className="ndata-style">Không có dữ liệu để hiển thị</h2>}
      <div className="foot-table" colSpan="7">
        <ArrowBackIcon className="btn-style" onClick={() => handleArrowBackMaxPage()} />
        <ArrowBackIosIcon className="btn-style" onClick={() => handleArrowBackPage(Event, page)} />
        {!isCatalogPage &&
          (isCheck ? (
            <DeleteIcon className="btn-style-delete" onClick={deleteData} />
          ) : (
            <AddCircleIcon className="btn-style" onClick={() => editModel(null)} />
          ))}

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
