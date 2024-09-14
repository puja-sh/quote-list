import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);

    // Check if the token exists in localStorage on component mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);  // Assume user is authenticated if token exists
        }
    }, []);

    // Login function to get token and store it
    const login = async (username, otp) => {
        try {
            const response = await fetch('https://assignment.stage.crafto.app/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, otp }),
            });

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export { AuthProvider, useAuth };
