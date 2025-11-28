import {Link, useHistory} from 'react-router-dom'
import Cookies from 'js-cookie'
import './Header.css'

const Header = () => {
  const history = useHistory()

  const onLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="header-container">
      {/* LEFT: LOGO + TITLE */}
      <Link to="/" className="header-logo-section">
        <img
          src="https://res.cloudinary.com/dh8jgl2ue/image/upload/v1759582225/Group_7420_e4ynxt.png"
          alt="website logo"
          className="header-logo"
        />
        <h1 className="header-title">Tasty Kitchens</h1>
      </Link>

      {/* CENTER: NAV ITEMS (UL with at least 6 li) */}
      <ul className="nav-items">
        <li>
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/cart" className="nav-link">
            Cart
          </Link>
        </li>
        <li>Offers</li>
        <li>Contact</li>
        <li>Help</li>
        <li>Profile</li>
      </ul>

      {/* RIGHT: LOGOUT */}
      <button type="button" className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </nav>
  )
}

export default Header
