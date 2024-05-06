import React from "react";
// import "./ErrorMessage.scss";
import "./navbar.scss";

function Navbar() {
  return (
    <div className="vertical-nav">
      <ul className="list-nav">
        <li>
          <img
            src="https://bootstrapious.com/i/snippets/sn-v-nav/avatar.png"
            alt="..."
            width="65"
            className="mr-3 rounded-circle img-thumbnail shadow-sm"
          />
        </li>
        <hr className="line-nav"></hr>
        <li>Thu</li>
        <li>Chi</li>
        <li>Tiết kiệm</li>
        <li>Đầu tư</li>
        <li>Danh mục</li>
        <li>Tổng hợp</li>
      </ul>
    </div>
  );
}

export default Navbar;
