import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/page/home/home";
import Income from "./components/page/income/income";
import Expense from "./components/page/expense/expense";
import Saving from "./components/page/saving/saving";
import Investment from "./components/page/investment/investment";
import Catalog from "./components/page/catalog/catalog";
import Generate from "./components/page/generate/generate";
import IncomeList from "./components/page/incomeList/incomeList";
import ExpenseList from "./components/page/expenseList/expenseList";
import BankList from "./components/page/bankList/bankList";
import CoinList from "./components/page/coinList/coinList";
import Register from "./components/auth/register";
import IncomeReport from "./components/page/income/incomeReport";
import ExpenseReport from "./components/page/expense/expenseReport";
import SavingReport from "./components/page/saving/savingReport";
import InvestReport from "./components/page/investment/investReport";
import Login from "./components/auth/login";

function Router({ isCheck, setIsCheck }) {
  return (
    <Routes>
      <Route exact path="/" element={<Home isCheck={isCheck} setIsCheck={setIsCheck} />} />
      <Route path="/income" element={<Income isCheck={isCheck} setIsCheck={setIsCheck} />} />
      <Route path="/expense" element={<Expense isCheck={isCheck} setIsCheck={setIsCheck} />} />
      <Route path="/saving" element={<Saving isCheck={isCheck} setIsCheck={setIsCheck} />} />
      <Route path="/invest" element={<Investment isCheck={isCheck} setIsCheck={setIsCheck} />} />
      <Route path="/catalog" element={<Catalog isCheck={isCheck} setIsCheck={setIsCheck} />} />
      <Route path="/generate" element={<Generate />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/incomelist"
        element={<IncomeList isCheck={isCheck} setIsCheck={setIsCheck} />}
      />
      <Route
        path="/expenselist"
        element={<ExpenseList isCheck={isCheck} setIsCheck={setIsCheck} />}
      />
      <Route path="/banklist" element={<BankList isCheck={isCheck} setIsCheck={setIsCheck} />} />
      <Route path="/coinlist" element={<CoinList isCheck={isCheck} setIsCheck={setIsCheck} />} />
      <Route
        path="/incomereport"
        element={<IncomeReport isCheck={isCheck} setIsCheck={setIsCheck} />}
      />
      <Route
        path="/expensereport"
        element={<ExpenseReport isCheck={isCheck} setIsCheck={setIsCheck} />}
      />
      <Route
        path="/savingreport"
        element={<SavingReport isCheck={isCheck} setIsCheck={setIsCheck} />}
      />
      <Route
        path="/investreport"
        element={<InvestReport isCheck={isCheck} setIsCheck={setIsCheck} />}
      />
    </Routes>
  );
}

export default Router;
