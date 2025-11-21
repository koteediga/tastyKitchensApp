import React from 'react'
import {Link, useHistory} from 'react-router-dom'
import Cookies from 'js-cookie'
import './Header.css'

const Header = () => {
  const history = useHistory()

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <div className="nav-left">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dh8jgl2ue/image/upload/v1759582225/Group_7420_e4ynxt.png"
            alt="website logo"
            className="website-logo"
          />
        </Link>
      </div>

      <ul className="nav-menu">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/cart">Cart</Link>
        </li>
        <li>Offers</li>
        <li>Contact</li>
      </ul>

      <button type="button" onClick={onClickLogout}>
        Logout
      </button>
    </nav>
  )
}

export default Header
