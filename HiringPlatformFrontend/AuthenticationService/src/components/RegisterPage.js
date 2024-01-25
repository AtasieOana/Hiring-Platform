import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {FormGroup, InputGroup, Intent, RadioGroup, Button, Radio} from '@blueprintjs/core';
import "./styles/Register.css"
import AuthenticationService from "../services/authentication.service";
import {RegisterRequest} from "../types/auth.types";
import {CANDIDATE_ACCOUNT, EMPLOYER_ACCOUNT} from "../util/constants";

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState(CANDIDATE_ACCOUNT);
    const [errors, setErrors] = useState({});

    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfPasswordVisibility = () => {
        setShowConfPassword(!showConfPassword);
    };

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
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Call the API for register
        registerUser();
        // Reset the errors if successful
        setErrors({});
    };

    const registerUser = () => {
        let registerRequest: RegisterRequest;
        registerRequest.email = email;
        registerRequest.password = password;
        registerRequest.username = username;
        registerRequest.accountType = userType;

        AuthenticationService.register(registerRequest).then((response) => {
            console.log(response)
        })

    }

    return (
        <div className="register-container">
            <div className="register-title">Register to Joblistic!</div>
            <div className="register-container-form">
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
                        placeholder="Enter 3 characters or more"
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
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        autoComplete="new-password"
                        placeholder="Enter 5 characters or more"
                        onChange={(e:any) => setPassword(e.target.value)}
                        rightElement={
                            <Button
                                className="password-button"
                                icon={showPassword ? 'eye-off' : 'eye-open'}
                                minimal={true}
                                onClick={togglePasswordVisibility}
                                small={true}
                                fill
                            />
                        }
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
                        type={showConfPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        placeholder="Enter the password again"
                        autoComplete="new-password"
                        onChange={(e:any) => setConfirmPassword(e.target.value)}
                        rightElement={
                            <Button
                                className="password-button"
                                icon={showConfPassword ? 'eye-off' : 'eye-open'}
                                minimal={true}
                                onClick={toggleConfPasswordVisibility}
                                small={true}
                                fill
                            />
                        }
                    />
                </FormGroup>
                <RadioGroup label="Choose the account type you want:"
                            onChange={(e:any) => setUserType(e.target.value)}
                            selectedValue={userType}
                            inline={true}
                            className="register-radio-group"
                >
                    <Radio label="Candidate" value={CANDIDATE_ACCOUNT} />
                    <Radio label="Employer" value={EMPLOYER_ACCOUNT} />
                </RadioGroup>
            </form>
            <Button onClick={handleRegister}
                    small={true}
                    className="register-button"
            >
                Continue
            </Button>
            </div>
            <div className="register-go-to-login">
                <Link to="login">
                    Already have an account? Login &#8594;
                </Link>
            </div>
        </div>
    );
};

export default RegisterPage;
