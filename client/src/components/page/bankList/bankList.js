/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import Table from "../../misc/Table.js";
import BankListEditor from "./bankListEditor.js";
import LoadingProgess from "../../misc/loadingProgess.js";
import AuthPage from "../../auth/authPage.js";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import "./bankList.scss";

function BankList({ isCheck, setIsCheck, isCatalogPage }) {
  const [bankListData, setBankListData] = useState();
  const [bankListEditorOpen, setBankListEditorOpen] = useState(false);
  const [editBankListData, setEditBankListData] = useState(null);

  const { user } = useContext(UserContext);

  const aTitle = isCatalogPage ? ["MÃ NGÂN HÀNG", "TÊN NGÂN HÀNG"] : ["MÃ", "NGÂN HÀNG"];
  const aKeyItem = ["stt", "bnkLstID", "bnkName"];
  const oRouter = {
    router: "banklist",
    name: "Danh mục ngân hàng",
  };

  function editBankList(bankListData) {
    setEditBankListData(bankListData);
    setBankListEditorOpen(true);
  }

  async function getBankLists() {
    const bankLists = await Axios.get(`${domain}/banklist/`);
    setBankListData(bankLists.data);
  }

  useEffect(() => {
    if (!user) setBankListData();
    else getBankLists();
  }, [user]);
  return (
    <>
      {user && !isCatalogPage && !bankListData && <LoadingProgess />}
      {user && bankListData && (
        <div className="bankList-container">
          <div className="title-container">
            {!isCatalogPage && <div className="title-bankList">DANH MỤC NGÂN HÀNG</div>}
          </div>

          {bankListEditorOpen ? (
            <BankListEditor
              getBankLists={getBankLists}
              setBankListEditorOpen={setBankListEditorOpen}
              editBankListData={editBankListData}
            />
          ) : (
            <>
              <Table
                oData={bankListData}
                aKeyItem={aKeyItem}
                aTitle={aTitle}
                rowsPerPage={10}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                editModel={editBankList}
                oRouter={oRouter}
                isCatalogPage={isCatalogPage}
                colorTitle={"#0ecb74"}
                navFooter={isCatalogPage ? "isCatalogPage" : "/saving"}
                titleFooter={"DANH SÁCH GỬI TIẾT KIỆM"}
              />
            </>
          )}
        </div>
      )}

      {user === null && <AuthPage />}
    </>
  );
}

export default BankList;
