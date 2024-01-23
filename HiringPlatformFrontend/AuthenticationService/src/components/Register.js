import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormGroup, InputGroup, Intent, RadioGroup, Button, Radio } from '@blueprintjs/core';
import "./styles/Register.css"

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('candidate');
    const [errors, setErrors] = useState({});

    const handleRegister = () => {
        // Validation for fields
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email address is required.';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newErrors.email = 'Email address is invalid.';
            }
        }
        if (!username) {
            newErrors.username = 'Username is required.';
        } else {
            const usernameRegex = /^[a-zA-Z0-9\- ]*$/;
            if(username.length < 3){
                newErrors.username = 'Username must have at least 3 characters.';
            }
            else if (!usernameRegex.test(username)) {
                newErrors.username = 'Username must contain only letters, digits, - and spaces.';
            }
        }
        if (!password) {
            newErrors.password = 'Password is required.';
        } else if (password.length < 5) {
            newErrors.password = 'Password must have at least 5 characters.';
        }
        if (!newErrors.password && password !== confirmPassword) {
            newErrors.confirmPassword = 'Password and Confirm Password must match.';
        }
        if (!userType) {
            newErrors.userType = 'User Type is required.';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Restul logicii pentru înregistrare...
        // Aici puteți trimite datele către server sau realiza alte acțiuni necesare

        // Reset the errors if successful
        setErrors({});
    };

    return (
        <div className="register-container">
            <div className="register-title">Welcome to Joblistic!</div>
            <div className="register-subtitle">Register</div>

            <form className="register-forms">
                <FormGroup
                    label="Email address"
                    intent={errors.email ? Intent.DANGER : Intent.NONE}
                    helperText={errors.email ? errors.email : ""}
                    className="register-form-group"
                    labelInfo="(required)"
                >
                    <InputGroup
                        value={email}
                        placeholder="example@gmail.com"
                        onChange={(e:any) => setEmail(e.target.value)}
                        asyncControl={true}
                    />
                </FormGroup>
                <FormGroup
                    label="Username"
                    intent={errors.username ? Intent.DANGER : Intent.NONE}
                    helperText={errors.username ? errors.username : ""}
                    className="register-form-group"
                    labelInfo="(required)"
                >
                    <InputGroup
                        type="text"
                        value={username}
                        autoComplete="new-user"
                        onChange={(e:any) => setUsername(e.target.value)}
                    />
                </FormGroup>
                <FormGroup
                    label="Password"
                    intent={errors.password ? Intent.DANGER : Intent.NONE}
                    helperText={errors.password ? errors.password : ""}
                    className="register-form-group"
                    labelInfo="(required)"
                >
                    <InputGroup
                        type="password"
                        value={password}
                        autoComplete="new-password"
                        onChange={(e:any) => setPassword(e.target.value)}
                    />
                </FormGroup>

                <FormGroup
                    label="Confirm Password"
                    intent={errors.confirmPassword ? Intent.DANGER : Intent.NONE}
                    helperText={errors.confirmPassword  ? errors.confirmPassword : ""}
                    className="register-form-group"
                    labelInfo="(required)"
                >
                    <InputGroup
                        type="password"
                        value={confirmPassword}
                        autoComplete="new-password"
                        onChange={(e:any) => setConfirmPassword(e.target.value)}
                    />
                </FormGroup>
                <RadioGroup label="Account type"
                            onChange={(e:any) => setUserType(e.target.value)}
                            selectedValue={userType}
                            inline={true}>
                    <Radio label="Candidate" value="candidate" />
                    <Radio label="Employer" value="employer" />
                </RadioGroup>
            </form>
            <Button onClick={handleRegister}>Register</Button>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
};

export default Register;
