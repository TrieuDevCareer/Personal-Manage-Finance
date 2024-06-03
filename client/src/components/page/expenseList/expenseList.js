/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
// import "./ErrorMessage.scss";
import { useNavigate } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Table from "../../misc/table.js";
import AuthPage from "../../auth/authPage.js";
import ExpenseListEditor from "./expenseListEditor.js";
import LoadingProgess from "../../misc/loadingProgess.js";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import "./expenseList.scss";

function ExpenseList({ isCheck, setIsCheck, isCatalogPage }) {
  const [expenseListData, setExpenseListData] = useState();
  const [expenseListEditorOpen, setExpenseListEditorOpen] = useState(false);
  const [editExpenseListData, setEditExpenseListData] = useState(null);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const aTitle = isCatalogPage ? ["QUỸ", "NỘI DUNG CHI TIÊU"] : ["NGUỒN QUỸ", "NỘI DUNG CHI TIÊU"];
  const aKeyItem = ["stt", "exelstCode", "exeLstContent"];
  const oRouter = {
    router: "expenselist",
    name: "Danh mục chi tiêu",
  };

  function editExpenseList(expenseListData) {
    setEditExpenseListData(expenseListData);
    setExpenseListEditorOpen(true);
  }

  async function getExpenseLists() {
    const expenseLists = await Axios.get(`${domain}/expenselist/`);
    setExpenseListData(expenseLists.data);
  }

  useEffect(() => {
    if (!user) setExpenseListData();
    else getExpenseLists();
  }, [user]);
  return (
    <div>
      {user && !isCatalogPage && !expenseListData && <LoadingProgess />}
      {user && expenseListData && (
        <div
          className="expenseList-container"
          style={{ gridAutoColumns: isCatalogPage ? "auto" : "68.6rem" }}
        >
          <div className="title-container">
            {!isCatalogPage && <div className="title-expenseList">DANH MỤC CHI TIÊU</div>}
          </div>
          {expenseListEditorOpen ? (
            <ExpenseListEditor
              getExpenseLists={getExpenseLists}
              setExpenseListEditorOpen={setExpenseListEditorOpen}
              editExpenseListData={editExpenseListData}
            />
          ) : (
            <div>
              <Table
                oData={expenseListData}
                aKeyItem={aKeyItem}
                aTitle={aTitle}
                rowsPerPage={10}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                editModel={editExpenseList}
                oRouter={oRouter}
                isCatalogPage={isCatalogPage}
                colorTitle={"#ff007f"}
              />
            </div>
          )}
          {!expenseListEditorOpen && !isCatalogPage && (
            <div
              className="footer-link"
              style={{ left: isCatalogPage ? "0rem" : "13rem" }}
              onClick={() => navigate("/expense")}
            >
              <OpenInNewIcon />
              <div className="footer-titel">DANH SÁCH CÁC KHOẢN CHI</div>
            </div>
          )}
        </div>
      )}

      {user === null && <AuthPage />}
    </div>
  );
}

export default ExpenseList;
