import React, { useContext } from "react";
// import "./ErrorMessage.scss";
import { useNavigate } from "react-router-dom";
import "./catalog.scss";
import UserContext from "../../../context/UserContext.js";
import IncomeList from "../incomeList/incomeList.js";
import ExpenseList from "../expenseList/expenseList.js";
import BankList from "../bankList/bankList.js";
import CoinList from "../coinList/coinList.js";
import AuthPage from "../../auth/authPage.js";

function Catalog() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <div>
      {user && (
        <div className="catalog-container">
          <div className="title-catalog">DANH MỤC</div>
          <div className="catalog-table-container">
            <div className="catalog-income">
              <IncomeList isCatalogPage={true} />
            </div>
            <div className="catalog-expense">
              <ExpenseList isCatalogPage={true} />
            </div>
            <div className="catalog-group">
              <div className="catalog-frs-group">
                <div className="catalog-saving">
                  <BankList isCatalogPage={true} />
                </div>
                <div className="catalog-invest">
                  <CoinList isCatalogPage={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {user === null && <AuthPage />}
    </div>
  );
}

export default Catalog;
