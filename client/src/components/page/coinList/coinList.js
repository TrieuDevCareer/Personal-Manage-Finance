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
import CoinListEditor from "./coinListEditor.js";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import "./coinList.scss";

function CoinList({ isCheck, setIsCheck, isCatalogPage }) {
  const [coinListData, setCoinListData] = useState([]);
  const [coinListEditorOpen, setCoinListEditorOpen] = useState(false);
  const [editCoinListData, setEditCoinListData] = useState(null);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const aTitle = isCatalogPage ? ["MÃ", "TÊN ĐỒNG COIN"] : ["MÃ", "TÊN ĐỒNG COIN"];
  const aKeyItem = ["stt", "coinLstID", "coinName"];
  const oRouter = {
    router: "coinlist",
    name: "Danh mục đồng coin",
  };

  function editCoinList(coinListData) {
    setEditCoinListData(coinListData);
    setCoinListEditorOpen(true);
  }

  async function getCoinLists() {
    const coinLists = await Axios.get(`${domain}/coinlist/`);
    setCoinListData(coinLists.data);
  }

  useEffect(() => {
    if (!user) setCoinListData([]);
    else getCoinLists();
  }, [user]);
  return (
    <div>
      {user && (
        <div className="coinList-container">
          <div className="title-container">
            {!isCatalogPage && <div className="title-coinList">DANH MỤC ĐỒNG COIN</div>}
          </div>

          {coinListEditorOpen ? (
            <CoinListEditor
              getCoinLists={getCoinLists}
              setCoinListEditorOpen={setCoinListEditorOpen}
              editCoinListData={editCoinListData}
            />
          ) : (
            <div>
              <Table
                oData={coinListData}
                aKeyItem={aKeyItem}
                aTitle={aTitle}
                rowsPerPage={10}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                editModel={editCoinList}
                oRouter={oRouter}
                isCatalogPage={isCatalogPage}
                colorTitle={"#0ecb74"}
              />
            </div>
          )}
          {!coinListEditorOpen && !isCatalogPage && (
            <div className="footer-link" onClick={() => navigate("/invest")}>
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

export default CoinList;
