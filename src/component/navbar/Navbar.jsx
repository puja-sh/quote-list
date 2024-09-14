import React from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css';
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleHome = () => {
        navigate('/home');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h2>Quote Today</h2>
            </div>
            <div className="navbar-links">
                <button className="navbar-btn" onClick={handleHome}>
                    Home
                </button>
                <button className="navbar-btn logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
