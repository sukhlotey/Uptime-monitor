import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../style/signup.css";
const Signup = () => {
  const [signup, setSignup] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { username, email, password } = signup;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        process.env.REACT_APP_HANDLE_SIGNUP_API,
        signup
      );
      console.log(res.data);
      const token = res.data.token
      localStorage.setItem('token', token);
      navigate("/login");
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="auth-container">
      <div className="left-side">
        <img
          className="signup-img"
          src="https://images.pexels.com/photos/20708329/pexels-photo-20708329/free-photo-of-view-of-a-starry-night-sky-above-a-body-of-water.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Left side"
        />
      </div>
      <div className="right-side">
        <h1 className="sign-head">SIGNUP</h1>
        <form onSubmit={handleSignup} className="signup-form">
          <input
            className="signup-username-input"
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          <input
            className="signup-email-input"
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            className="signup-password-input"
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <button className="signup-btn" type="submit">
            Signup
          </button>
          <p className="available-account">
            Already have an account?<Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
