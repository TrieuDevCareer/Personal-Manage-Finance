import Axios from "axios";
import React from "react";
import { BrowserRouter } from "react-router-dom";
// import { UserContextProvider } from "./context/UserContext";
import Router from "./Router";
import Navbar from "./components/misc/navbar";
import Header from "./components/misc/header";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/index.scss";

Axios.defaults.withCredentials = true;

function App() {
  return (
    <BrowserRouter>
      <div className="container-style">
        <div className="gird-container">
          <div className="vertical-navbar">
            <Navbar />
          </div>
          <div className="group-left-area">
            <div className="header-navbar">
              <Header />
            </div>
            <div className="router">
              <Router />
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
