import React from "react";
import { Route, Routes } from "react-router-dom";
import Income from "./components/page/income/income";
import Expense from "./components/page/expense/expense";

function Router() {
  return (
    <Routes>
      <Route exact path="/" element={<Income />} />
      <Route exact path="/expense" element={<Expense />} />
    </Routes>
  );
}

export default Router;
