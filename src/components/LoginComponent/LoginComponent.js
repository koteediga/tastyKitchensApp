import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import './LoginComponent.css';

export const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const onchangeUsername = (e) => setUsername(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);

  const onSubmitSuccess = (jwtToken) => {
    Cookies.set('jwt_token', jwtToken, { expires: 30 });
    history.push('/'); // redirect after login
  };

  const onSubmitFailure = () => {
    setError("Please enter a valid Username and Password");
  };

  const onFormValidation = async (e) => {
    e.preventDefault();
    const userDetails = { username, password };

    const response = await fetch('https://apis.ccbp.in/login', {
      method: 'POST',
      body: JSON.stringify(userDetails),
    });

    const data = await response.json();

    if (response.ok) {
      onSubmitSuccess(data.jwt_token);
    } else {
      onSubmitFailure();
    }
  };

  return (
    <div className="login-route">
      <div className="login-container">
        <img
          src="https://res.cloudinary.com/dh8jgl2ue/image/upload/v1759582225/Group_7420_e4ynxt.png"
          alt="website logo"
          className="logo"
        />
        <h1 className="app-title">Tasty Kitchens</h1>

        <form className="login-form" onSubmit={onFormValidation}>
          <h1 className="login-heading">Login</h1>

          <label htmlFor="username" className="input-label">USERNAME</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={onchangeUsername}
            className="input-field"
          />

          <label htmlFor="password" className="input-label">PASSWORD</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={onChangePassword}
            className="input-field"
          />

          <button type="submit" className="login-button">Login</button>

          {error && <p className="error-message">*{error}</p>}
        </form>
      </div>

      <div className="login-split-right">
        <img
          src="https://res.cloudinary.com/dh8jgl2ue/image/upload/v1759583551/Rectangle_1456_ajcgte.png"
          alt="website login"
          className="login-food-image"
        />
      </div>
    </div>
  );
};
