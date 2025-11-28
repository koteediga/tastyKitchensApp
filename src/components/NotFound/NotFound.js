import {Link} from 'react-router-dom'
import './NotFound.css'

const NotFound = () => (
  <div className="notfound-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/not-found-img.png"
      alt="not found"
      className="notfound-img"
    />
    <h1>Page Not Found</h1>
    <p>we are sorry, the page you requested could not be found</p>
    <Link to="/">
      <button type="button">Home Page</button>
    </Link>
  </div>
)

export default NotFound
