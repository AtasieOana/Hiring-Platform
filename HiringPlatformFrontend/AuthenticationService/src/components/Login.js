// Login.js
import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div>
            <h1>Login Page</h1>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
            Sa nu uiti de FORGET PASSWORD!!!!!!!!!!!!!!!!!!!!!!!!!
        </div>
    );
};

export default Login;
