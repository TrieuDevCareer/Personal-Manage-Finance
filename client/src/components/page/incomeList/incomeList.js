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

export default IncomeList;
