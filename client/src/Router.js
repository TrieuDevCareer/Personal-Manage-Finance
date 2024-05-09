import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/page/home/home";
import Income from "./components/page/income/income";
import Expense from "./components/page/expense/expense";
import Saving from "./components/page/saving/saving";
import Investment from "./components/page/investment/investment";
import Catalog from "./components/page/catalog/catalog";
import Generate from "./components/page/generate/generate";
import BarChartType from "./components/misc/charts/barChart";
import AreaChartType from "./components/misc/charts/areaChart";
import PieChartType from "./components/misc/charts/pieChart";
import IncomeEditor from "./components/page/income/incomeEditor";
import Register from "./components/auth/register";

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
    </Routes>
  );
}

export default Router;
