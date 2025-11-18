import React from "react";
import { Link, useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import "./Header.css";

export const Header = () => {
  const history = useHistory();

  const onClickLogout = () => {
    Cookies.remove("jwt_token");
    history.push("/login");
  };

  return (
    <nav className="nav-header">
      <div className="nav-left">
        <img
          className="website-logo"
          src="https://res.cloudinary.com/dh8jgl2ue/image/upload/v1759582225/Group_7420_e4ynxt.png"
          alt="website logo"
        />
        <span className="app-title">Tasty Kitchens</span>
      </div>
      <div className="nav-right">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/cart" className="nav-link">Cart</Link>
        <button type="button" className="logout-btn" onClick={onClickLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Header;
