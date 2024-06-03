import Axios from "axios";
import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./context/UserContext";
import Router from "./Router";
import Navbar from "./components/misc/navbar";
import Header from "./components/misc/header";
import ArrowRightSharpIcon from "@mui/icons-material/ArrowRightSharp";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/index.scss";

Axios.defaults.withCredentials = true;

function App() {
  let [clickPattern, setClickPattern] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenuOnMobile = () => {
    if (window.outerWidth <= 375) {
      setShowMenu(false);
    }
  };
  useEffect(() => {}, [isCheck]);
  return (
    <UserContextProvider>
      <BrowserRouter>
        <div className="container-style">
          <div className="gird-container ">
            <ArrowRightSharpIcon
              className={`navbar-icon ${showMenu ? "transition" : ""}`}
              onClick={toggleMenu}
            />
            <div className={`vertical-navbar ${showMenu ? "show-menu" : ""}`}>
              <Navbar
                clickPattern={clickPattern}
                setClickPattern={setClickPattern}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                toggleMenu={toggleMenu}
                showMenu={showMenu}
                closeMenuOnMobile={closeMenuOnMobile}
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
    </UserContextProvider>
  );
}

export default App;
