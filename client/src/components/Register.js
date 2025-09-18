// src/pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Register.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [birth, setBirth] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/auth/register', {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, gender, birth}),
      credentials:"include"
    });

    const data = await response.json();

    if (response.ok) {
      alert('Registration Successful');
      navigate('/login'); // Redirect to the login page
    } else {
      alert(data.message || 'Registration Failed');
    }
  };

  return (
    <div className='register-background'>
      <div className="register-container">
        <div className="register-box">
          <h1>Create Account</h1>
          <form onSubmit={handleSubmit}>
            <input
              className="register-input"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <select 
              className="register-input"
              value={gender} 
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="" disabled selected>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="other">Other</option>
            </select>
            <input
              className="register-input"
              type="Date"
              placeholder="Date of birth"
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
              required
            />
            <input
              className="register-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="register-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="register-button" type="submit">Register</button>
          </form>
          <div className="login-link">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
