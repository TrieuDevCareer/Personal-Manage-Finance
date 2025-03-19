import React from "react";
import { Route, Routes } from "react-router-dom";

// Page imports
import Home from "./components/page/home/home";
import Income from "./components/page/income/income";
import Expense from "./components/page/expense/expense";
import Saving from "./components/page/saving/saving";
import Investment from "./components/page/investment/investment";
import Catalog from "./components/page/catalog/catalog";
import InBody from "./components/page/inbody/inBody";
import InBodyList from "./components/page/inbodyList/inbodyList";
import IncomeList from "./components/page/incomeList/incomeList";
import ExpenseList from "./components/page/expenseList/expenseList";
import BankList from "./components/page/bankList/bankList";
import CoinList from "./components/page/coinList/coinList";
import IncomeReport from "./components/page/income/incomeReport";
import ExpenseReport from "./components/page/expense/expenseReport";
import SavingReport from "./components/page/saving/savingReport";
import InvestReport from "./components/page/investment/investReport";
import User from "./components/page/user/user";

// Auth imports
import Login from "./components/auth/login";
import Register from "./components/auth/register";

function Router({ isCheck, setIsCheck }) {
  // Components that need check props
  const withCheckProps = (Component) => (
    <Component isCheck={isCheck} setIsCheck={setIsCheck} />
  );

  // Components that don't need check props
  const withoutCheckProps = (Component) => <Component />;

  return (
    <Routes>
      {/* Main pages */}
      <Route exact path="/" element={withCheckProps(Home)} />
      <Route path="/income" element={withCheckProps(Income)} />
      <Route path="/expense" element={withCheckProps(Expense)} />
      <Route path="/saving" element={withCheckProps(Saving)} />
      <Route path="/invest" element={withCheckProps(Investment)} />
      <Route path="/catalog" element={withCheckProps(Catalog)} />

      {/* List pages */}
      <Route path="/incomelist" element={withCheckProps(IncomeList)} />
      <Route path="/expenselist" element={withCheckProps(ExpenseList)} />
      <Route path="/banklist" element={withCheckProps(BankList)} />
      <Route path="/coinlist" element={withCheckProps(CoinList)} />
      <Route path="/inbodyList" element={withCheckProps(InBodyList)} />

      {/* Report pages */}
      <Route path="/incomereport" element={withCheckProps(IncomeReport)} />
      <Route path="/expensereport" element={withCheckProps(ExpenseReport)} />
      <Route path="/savingreport" element={withCheckProps(SavingReport)} />
      <Route path="/investreport" element={withCheckProps(InvestReport)} />

      {/* Other pages */}
      <Route path="/inbody" element={withCheckProps(InBody)} />
      <Route path="/user" element={withCheckProps(User)} />

      {/* Auth pages */}
      <Route path="/login" element={withoutCheckProps(Login)} />
      <Route path="/register_none_defind" element={withoutCheckProps(Register)} />
    </Routes>
  );
}

export default Router;