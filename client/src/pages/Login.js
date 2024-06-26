import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../style/login.css';
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const { email, password } = login;

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(process.env.REACT_APP_HANDLE_LOGIN_API, login);
      console.log(res.data);
      const token = res.data.token
      localStorage.setItem('token', token);
      navigate('/dashboard')
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="auth-container-login">
      <div className="left-side-login">
        <img className="login-img" src="https://images.pexels.com/photos/20708329/pexels-photo-20708329/free-photo-of-view-of-a-starry-night-sky-above-a-body-of-water.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Left side" />
      </div>
      <div className="right-side-login">
        <h1 className="login-head-login">LOGIN</h1>
        <form onSubmit={handleLogin}>
          <input
            className="login-username-input"
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="email"
            required
          />
          <input
            className="login-password-input"
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <button className="login-btn" type="submit">Login</button>
          <p className="available-account">Don't have an account? <Link to='/signup'>Signup</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
