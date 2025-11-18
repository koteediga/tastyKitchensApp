import React from 'react'
import { useHistory } from 'react-router-dom';
import './NotFound.css'


const NotFound = () => {
  const history = useHistory()
  return (
    <div className="page-not-found">
      <img
        src="https://res.cloudinary.com/dh8jgl2ue/image/upload/v1759585064/erroring_1_z2iuja.png"
        alt="not found" // required by test cases
        className="not-found-image"
      />
      <h1 className="not-found-title">Page Not Found</h1>
      <p className="not-found-desc">
        We are sorry, the page you requested could not be found.<br/>
        Please go back to the homepage
      </p>
      <button className="home-page-btn" onClick={() => history.push('/')}>
        Home Page
      </button>
    </div>
  )
}

export default NotFound
