// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';
//require('dotenv').config(); 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    //const response = await fetch('`${process.env.REACT_APP_API_BASE_URL}/api/auth/login', {
    const response = await fetch('http://localhost:5000/api/auth/login', {
          
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      //alert('Login Successful');
      localStorage.setItem('token', data.token);
      navigate('/Profile'); // Redirect to the home page
    } else {
      alert(data.message || 'Login Failed');
    }
  };

  return (
    <div className='login-background'>
      <div className="login-container">
        <div className="login-box">
          <h1>Welcome Back!</h1>
          <form onSubmit={handleSubmit}>
            <input
              className="login-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="login-button" type="submit">Login</button>
          </form>
          <div className="register-link">
            <p>Do not have an account? <Link to="/register">Register</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
