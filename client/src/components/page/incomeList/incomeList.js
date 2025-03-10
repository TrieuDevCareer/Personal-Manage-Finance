/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import AuthPage from "../../auth/authPage.js";
import Table from "../../misc/Table.js";
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
    <>
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
            <>
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
                navFooter={isCatalogPage ? "isCatalogPage" : "/income"}
                titleFooter={"DANH SÁCH CÁC KHOẢN THU"}
              />
            </>
          )}
        </div>
      )}

      {user === null && <AuthPage />}
    </>
  );
}

export default IncomeList;
