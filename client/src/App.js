import Axios from "axios";
import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
// import { UserContextProvider } from "./context/UserContext";
import Router from "./Router";
import Navbar from "./components/misc/navbar";
import Header from "./components/misc/header";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/index.scss";

Axios.defaults.withCredentials = true;

function App() {
  let [clickPattern, setClickPattern] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  useEffect(() => {}, [isCheck]);
  return (
    <BrowserRouter>
      <div className="container-style">
        <div className="gird-container">
          <div className="vertical-navbar">
            <Navbar
              clickPattern={clickPattern}
              setClickPattern={setClickPattern}
              isCheck={isCheck}
              setIsCheck={setIsCheck}
            />
          </div>
          <div className="group-left-area">
            <div className="header-navbar">
              <Header clickPattern={clickPattern} setClickPattern={setClickPattern} />
            </div>
            <div className="router">
              <Router isCheck={isCheck} setIsCheck={setIsCheck} />
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
