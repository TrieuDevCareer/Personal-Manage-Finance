/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
// import "./ErrorMessage.scss";
import { useNavigate } from "react-router-dom";
import { Stack, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Table from "../../misc/table.js";
import BankListEditor from "./bankListEditor.js";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import "./bankList.scss";

function BankList({ isCheck, setIsCheck, isCatalogPage }) {
  const [bankListData, setBankListData] = useState([]);
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
    if (!user) setBankListData([]);
    else getBankLists();
  }, [user]);
  return (
    <div>
      {user && (
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
            <div className="footer-link" onClick={() => navigate("/saving")}>
              <OpenInNewIcon />
              <div className="footer-titel">DANH SÁCH ĐẦU TƯ</div>
            </div>
          )}
        </div>
      )}

      {user === null && (
        <div className="auth-container">
          <div className="auth-style">
            <h1 className="auth-ele auth-title">HỆ THỐNG QUẢN LÝ TÀI CHÍNH CÁ NHÂN</h1>
            <h3 className="auth-ele auth-desc">Quản lý theo cách bạn muốn</h3>

            <Stack spacing={2} direction="row" justifyContent="center">
              <Button
                variant="contained"
                color="success"
                size="medium"
                startIcon={<LoginIcon />}
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </Button>
              <Button
                variant="contained"
                color="info"
                startIcon={<HowToRegIcon />}
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </Button>
            </Stack>
          </div>
        </div>
      )}
    </div>
  );
}

export default BankList;
