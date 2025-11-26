import {useState} from 'react'
import {Redirect, useHistory} from 'react-router-dom'
import Cookies from 'js-cookie'
import './LoginComponent.css'

const LoginComponent = () => {
  const history = useHistory()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const jwtToken = Cookies.get('jwt_token')

  if (jwtToken !== undefined) {
    return <Redirect to="/" />
  }

  const onSubmitForm = async event => {
    event.preventDefault()

    if (username === '' && password === '') {
      setErrorMsg('Please enter username and password')
      return
    }
    if (username !== '' && password === '') {
      setErrorMsg('Please enter password')
      return
    }
    if (username === '' && password !== '') {
      setErrorMsg('Please enter username')
      return
    }

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
      history.replace('/')
    } else {
      setErrorMsg(data.error_msg)
    }
  }

  return (
    <div className="login-container">
      <img
        src="https://res.cloudinary.com/dh8jgl2ue/image/upload/v1759582225/Group_7420_e4ynxt.png"
        alt="website logo"
        className="login-website-logo"
      />

      <h1 className="login-title">Tasty Kitchens</h1>
      <h1 className="login-subtitle">Login</h1>

      <div className="login-content">
        <img
          src="https://assets.ccbp.in/frontend/react-js/login-img.png"
          alt="website login"
          className="login-side-image"
        />

        <form className="login-form" onSubmit={onSubmitForm}>
          <label htmlFor="username">USERNAME</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <label htmlFor="password">PASSWORD</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>

          {errorMsg !== '' && <p className="error-message">{errorMsg}</p>}
        </form>
      </div>
    </div>
  )
}

export default LoginComponent
