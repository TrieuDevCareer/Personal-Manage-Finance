/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
// import "./ErrorMessage.scss";
import { useNavigate } from "react-router-dom";
import AuthPage from "../../auth/authPage.js";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Table from "../../misc/table.js";
import IncomeListEditor from "./incomeListEditor.js";
import LoadingProgess from "../../misc/loadingProgess.js";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import "./incomeList.scss";

function IncomeList({ isCheck, setIsCheck, isCatalogPage }) {
  const [incomeListData, setIncomeListData] = useState();
  const [incomeListEditorOpen, setIncomeListEditorOpen] = useState(false);
  const [editIncomeListData, setEditIncomeListData] = useState(null);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const aTitle = isCatalogPage ? ["QUỸ", "NỘI DUNG THU NHẬP"] : ["NGUỒN QUỸ", "NỘI DUNG THU NHẬP"];
  const aKeyItem = ["stt", "inlstCode", "inLstContent"];
  const oRouter = {
    router: "incomelist",
    name: "Danh mục thu nhập",
  };

  function editIncomeList(incomeListData) {
    setEditIncomeListData(incomeListData);
    setIncomeListEditorOpen(true);
  }

  async function getIncomeLists() {
    const incomeLists = await Axios.get(`${domain}/incomelist/`);
    setIncomeListData(incomeLists.data);
  }

  useEffect(() => {
    if (!user) setIncomeListData();
    else getIncomeLists();
  }, [user]);
  return (
    <div>
      {user && !incomeListData && !isCatalogPage && <LoadingProgess />}
      {user && incomeListData && (
        <div className="incomeList-container">
          <div className="title-container">
            {!isCatalogPage && <div className="title-incomeList">DANH MỤC THU NHẬP</div>}
          </div>

          {incomeListEditorOpen ? (
            <IncomeListEditor
              getIncomeLists={getIncomeLists}
              setIncomeListEditorOpen={setIncomeListEditorOpen}
              editIncomeListData={editIncomeListData}
            />
          ) : (
            <div>
              <Table
                oData={incomeListData}
                aKeyItem={aKeyItem}
                aTitle={aTitle}
                rowsPerPage={10}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                editModel={editIncomeList}
                oRouter={oRouter}
                isCatalogPage={isCatalogPage}
                colorTitle={"#0ecb74"}
              />
            </div>
          )}
          {!incomeListEditorOpen && !isCatalogPage && (
            <div className="footer-link" onClick={() => navigate("/income")}>
              <OpenInNewIcon />
              <div className="footer-titel">DANH SÁCH CÁC KHOẢN THU</div>
            </div>
          )}
        </div>
      )}

      {user === null && <AuthPage />}
    </div>
  );
}

export default IncomeList;
