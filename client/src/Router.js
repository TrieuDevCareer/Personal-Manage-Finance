import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/page/home/home";
import Income from "./components/page/income/income";
import Expense from "./components/page/expense/expense";
import Saving from "./components/page/saving/saving";
import Investment from "./components/page/investment/investment";

function Router() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/income" element={<Income />} />
      <Route path="/expense" element={<Expense />} />
      <Route path="/saving" element={<Saving />} />
      <Route path="/invest" element={<Investment />} />
    </Routes>
  );
}

export default Router;
