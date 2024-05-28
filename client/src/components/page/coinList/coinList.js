/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
// import "./ErrorMessage.scss";
import { useNavigate } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Table from "../../misc/table.js";
import CoinListEditor from "./coinListEditor.js";
import LoadingProgess from "../../misc/loadingProgess.js";
import AuthPage from "../../auth/authPage.js";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import "./coinList.scss";

function CoinList({ isCheck, setIsCheck, isCatalogPage }) {
  const [coinListData, setCoinListData] = useState();
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
    if (!user) setCoinListData();
    else getCoinLists();
  }, [user]);
  return (
    <div>
      {user && !isCatalogPage && !coinListData && <LoadingProgess />}
      {user && coinListData && (
        <div
          className="coinList-container"
          style={{ gridAutoColumns: isCatalogPage ? "auto" : "68.6rem" }}
        >
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
                colorTitle={"#ff007f"}
              />
            </div>
          )}
          {!coinListEditorOpen && !isCatalogPage && (
            <div
              className="footer-link"
              style={{ left: isCatalogPage ? "0rem" : "13rem" }}
              onClick={() => navigate("/invest")}
            >
              <OpenInNewIcon />
              <div className="footer-titel">DANH SÁCH ĐẦU TƯ</div>
            </div>
          )}
        </div>
      )}

      {user === null && <AuthPage />}
    </div>
  );
}

export default CoinList;
