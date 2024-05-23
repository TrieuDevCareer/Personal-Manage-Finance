import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
// import "./ErrorMessage.scss";
import { useNavigate } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Table from "../../misc/table.js";
import IncomeEditor from "./incomeEditor.js";
import AuthPage from "../../auth/authPage.js";
import LoadingProgess from "../../misc/loadingProgess.js";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import "./income.scss";

function Income({ isCheck, setIsCheck }) {
  const [incomeData, setIncomeData] = useState();
  const [incomeEditorOpen, setIncomeEditorOpen] = useState(false);
  const [editIncomeData, setEditIncomeData] = useState(null);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const aTitle = ["NGÀY THÁNG", "DANH MỤC THU", " QUỸ-TÀI KHOẢN", "NỘI DUNG THU", "SỐ TIỀN THU"];
  const aKeyItem = ["stt", "incDate", "inLstContent", "inlstCode", "incDetail", "incMoney"];
  const oRouter = {
    router: "income",
    name: "Bảng thu nhập",
  };

  function editIncome(incomeData) {
    setEditIncomeData(incomeData);
    setIncomeEditorOpen(true);
  }

  async function getIncomes() {
    const incomes = await Axios.get(`${domain}/income/`);
    incomes.data.map((i) => {
      i.incMoney = i.incMoney.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      });
      let today = i.incDate;
      today = Date.parse(today);
      i.incDate = new Date(today).toISOString().split("T")[0];
      // eslint-disable-next-line no-sequences
      return i.incMoney, i.incDate;
    });
    setIncomeData(incomes.data);
  }

  useEffect(() => {
    if (!user) setIncomeData();
    else getIncomes();
  }, [user]);
  return (
    <div>
      {user && !incomeData && <LoadingProgess />}
      {user && incomeData && (
        <div className="income-container">
          <div className="title-container">
            <div className="title-income">DANH SÁCH CÁC KHOẢN THU</div>
          </div>
          {incomeEditorOpen ? (
            <IncomeEditor
              getIncomes={getIncomes}
              setIncomeEditorOpen={setIncomeEditorOpen}
              editIncomeData={editIncomeData}
            />
          ) : (
            <div>
              <Table
                oData={incomeData}
                aKeyItem={aKeyItem}
                aTitle={aTitle}
                rowsPerPage={10}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                editModel={editIncome}
                oRouter={oRouter}
                colorTitle={"#0ecb74"}
              />
            </div>
          )}
          {!incomeEditorOpen && (
            <div className="footer-link" onClick={() => navigate("/incomelist")}>
              <OpenInNewIcon />
              <div className="footer-titel">DANH MỤC THU NHẬP</div>
            </div>
          )}
        </div>
      )}

      {user === null && <AuthPage />}
    </div>
  );
}

export default Income;
