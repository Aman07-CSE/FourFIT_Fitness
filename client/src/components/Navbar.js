import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isAuthenticated = localStorage.getItem('token');

    return (
        <header>
            <NavLink to="/" className="logo">4<span>Fit</span></NavLink>
            <ul className="navbar">
                <li><NavLink to="/">Home</NavLink></li>
                <li><a href="/#features">Features</a></li>
                <li><a href="/#about-us">About Us</a></li>
                
                <li><NavLink to="/dietPlanner">Diet Planner</NavLink></li>
                <li><NavLink to="/exercise">Exercise</NavLink></li>
                <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                <li><NavLink to="/Bodyscore">Bodyscore</NavLink></li>
                <li><NavLink to="/profile">Profile</NavLink></li>
            </ul>
            <div className="top-btn">
                {isAuthenticated ? (
                    <button className="nav-btn" onClick={handleLogout}>Sign Out</button>
                ) : (
                    <Link to="/login" className="nav-btn">Log in</Link>
                )}
            </div>
        </header>
    );
};

export default Navbar;
