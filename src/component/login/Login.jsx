import React, { useState } from 'react';
import './login.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('sandy');
    const [otp, setOtp] = useState('1234');
    const { login } = useAuth();
    const navigate = useNavigate();

    const onLoginHandler = async (e) => {
        e.preventDefault();
        await login(username, otp);
        navigate('/home');
    }

    return (
        <div className="login-container">
            <h1>LOGIN</h1>
            <p>Welcome</p>
            <div className="form-container">
                <input
                    type='text'
                    value={username}
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    value={otp}
                    placeholder="OTP"
                    onChange={(e) => setOtp(e.target.value)}
                />
            </div>

            <button onClick={ onLoginHandler } className='login-btn'> Login</button>
        </div>
    );
};

export default Login;
