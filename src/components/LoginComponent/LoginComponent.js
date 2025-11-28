import {useState} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './LoginComponent.css'

const LoginComponent = props => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken !== undefined) {
    return <Redirect to="/" />
  }

  const onSubmitForm = async event => {
    event.preventDefault()

    const userDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      const {history} = props
      history.replace('/')
    } else {
      setErrorMsg(data.error_msg)
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-card">
          <img
            src="https://res.cloudinary.com/dh8jgl2ue/image/upload/v1759582225/Group_7420_e4ynxt.png"
            alt="website logo"
            className="login-logo"
          />
          <h1 className="login-title">Tasty Kitchens</h1>

          <h2 className="login-heading">Login</h2>

          <form onSubmit={onSubmitForm} className="login-form">
            <label htmlFor="username">USERNAME</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
            />

            <label htmlFor="password">PASSWORD</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
            />

            <button type="submit" className="login-btn">
              Login
            </button>

            {errorMsg !== '' && <p className="error-msg">*{errorMsg}</p>}
          </form>
        </div>
      </div>

      <div className="login-right">
        <img
          className="login-img"
          alt="website login"
          src="https://res.cloudinary.com/dh8jgl2ue/image/upload/v1759583551/Rectangle_1456_ajcgte.png"
        />
      </div>
    </div>
  )
}

export default LoginComponent
