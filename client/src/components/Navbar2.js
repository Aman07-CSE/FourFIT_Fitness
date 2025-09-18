// navbar.js
import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
// Import an icon library if you have one, or use a simple character/SVG
// For simplicity, we'll use a div structure for the hamburger icon managed by CSS
// Alternatively, you could use libraries like react-icons:
// import { FaBars, FaTimes } from 'react-icons/fa'; 

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsMenuOpen(false); // Close menu on logout
        navigate('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Function to close menu when a link is clicked
    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };


    const isAuthenticated = localStorage.getItem('token');

    return (
        <header>
            <NavLink to="/" className="logo" onClick={handleLinkClick}>
            4<span>Fit</span></NavLink>

            {/* Hamburger Icon - shown only on mobile via CSS */}
            <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} id="menu-icon">
                {/* You can use an icon library here like <FaBars /> or simple spans */}
                <span></span>
                <span></span>
                <span></span>
            </div>

            {/* Navigation Links - add 'active' class when menu is open */}
            {/* Add onClick={handleLinkClick} to each link/item if you want the menu to close */}
            <ul className={`navbar ${isMenuOpen ? 'active' : ''}`}>
                <li><NavLink to="/" onClick={handleLinkClick}>Home</NavLink></li>
                {/* Use anchor links carefully with React Router. Consider using React Scroll or handling scroll manually if these are sections on the home page */}
                <li><a href="/#features" onClick={handleLinkClick}>Features</a></li>
                <li><a href="/#about-us" onClick={handleLinkClick}>About Us</a></li>

                {isAuthenticated && ( // Conditionally render authenticated links
                    <>
                        <li><NavLink to="/dietPlanner" onClick={handleLinkClick}>Diet Planner</NavLink></li>
                        <li><NavLink to="/exercise" onClick={handleLinkClick}>Exercise</NavLink></li>
                        <li><NavLink to="/dashboard" onClick={handleLinkClick}>Dashboard</NavLink></li>
                        <li><NavLink to="/Bodyscore" onClick={handleLinkClick}>Bodyscore</NavLink></li>
                        <li><NavLink to="/profile" onClick={handleLinkClick}>Profile</NavLink></li>
                    </>
                )}
                 {!isAuthenticated && ( // Only show login link if not authenticated inside the mobile menu
                    <li className="mobile-login-link"><Link to="/login" className="nav-btn" onClick={handleLinkClick}>Log in</Link></li>
                 )}
                  {isAuthenticated && ( // Only show logout button if authenticated inside the mobile menu
                    <li className="mobile-logout-btn"><button className="nav-btn" onClick={handleLogout}>Sign Out</button></li>
                 )}
            </ul>

            {/* Login/Logout Button - Hide this specific div on mobile if handled within the ul */}
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