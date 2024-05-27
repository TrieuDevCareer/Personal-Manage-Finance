/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
// import "./ErrorMessage.scss";
import { useNavigate } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Table from "../../misc/table.js";
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
  const navigate = useNavigate();

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
    <div>
      {user && !isCatalogPage && !bankListData && <LoadingProgess />}
      {user && bankListData && (
        <div
          className="bankList-container"
          style={{ gridAutoColumns: isCatalogPage ? "auto" : "68.6rem" }}
        >
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
            <div>
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
              />
            </div>
          )}
          {!bankListEditorOpen && !isCatalogPage && (
            <div
              className="footer-link"
              style={{ left: isCatalogPage ? "0rem" : "13rem" }}
              onClick={() => navigate("/saving")}
            >
              <OpenInNewIcon />
              <div className="footer-titel">DANH SÁCH GỬI TIẾT KIỆM</div>
            </div>
          )}
        </div>
      )}

      {user === null && <AuthPage />}
    </div>
  );
}

export default BankList;
