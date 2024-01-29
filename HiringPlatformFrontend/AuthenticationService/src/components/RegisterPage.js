import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {FormGroup, InputGroup, Intent, RadioGroup, Button, Radio} from '@blueprintjs/core';
import "./styles/Register.css"
import AuthenticationService from "../services/authentication.service";
import {RegisterRequest, RegisterResponse} from "../types/auth.types";
import {CANDIDATE_ACCOUNT, EMPLOYER_ACCOUNT} from "../util/constants";
import {useTranslation} from "react-i18next";

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState(CANDIDATE_ACCOUNT);
    const [errors, setErrors] = useState({});

    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);

    const { t } = useTranslation()

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
            newErrors.emailRequired = true;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newErrors.emailInvalid = true;
            }
        }
        if (!username) {
            newErrors.usernameRequired = true;
        } else {
            const usernameRegex = /^[a-zA-Z0-9\- ]*$/;
            if(username.length < 3){
                newErrors.usernameLen = true;
            }
            else if (!usernameRegex.test(username)) {
                newErrors.usernameInvalid =  true;
            }
        }
        if (!password) {
            newErrors.passwordRequired =  true;
        } else if (password.length < 5) {
            newErrors.passwordLen = true;
        }
        if (!newErrors.password && password !== confirmPassword) {
            newErrors.confirmPassword = true;
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
        let registerRequest: RegisterRequest = {};
        registerRequest.email = email;
        registerRequest.password = password;
        registerRequest.username = username;
        registerRequest.accountType = userType;
        console.log(registerRequest);
        AuthenticationService.register((registerRequest)).then((response: RegisterResponse) => {
            console.log(response)
        })

    }

    let mailError = "";
    if(errors.emailRequired){
        mailError = t('email_address_req');
    } else if(errors.emailInvalid){
        mailError = t('email_address_in');
    }
    let usernameError = "";
    if(errors.usernameRequired){
        usernameError = t('username_req');
    } else if(errors.usernameLen){
        usernameError = t('username_len');
    } else if(errors.usernameInvalid){
        usernameError = t('username_content');
    }
    let passwordError = "";
    if(errors.passwordRequired){
        passwordError = t('password_req');
    } else if(errors.passwordLen){
        passwordError = t('password_len');
    }
    let confirmError = "";
    if(errors.confirmPassword){
        confirmError = t('password_confirm');
    }

    return (
        <div className="register-container">
            <div className="register-title">{t('register_to')} Joblistic!</div>
            <div className="register-container-form">
            <form className="register-forms">
                <FormGroup
                    label={t('email_address')}
                    intent={mailError ? Intent.DANGER : Intent.NONE}
                    helperText={mailError ? mailError : ""}
                    className="register-form-group"
                    labelInfo={t('required')}
                >
                    <InputGroup
                        value={email}
                        placeholder="mail@gmail.com"
                        onChange={(e:any) => setEmail(e.target.value)}
                        asyncControl={true}
                    />
                </FormGroup>
                <FormGroup
                    label={t('username')}
                    intent={usernameError ? Intent.DANGER : Intent.NONE}
                    helperText={usernameError ? usernameError : ""}
                    className="register-form-group"
                    labelInfo={t('required')}
                >
                    <InputGroup
                        type="text"
                        value={username}
                        placeholder={t('username_placeholder')}
                        autoComplete="new-user"
                        onChange={(e:any) => setUsername(e.target.value)}
                    />
                </FormGroup>
                <FormGroup
                    label={t('password')}
                    intent={passwordError ? Intent.DANGER : Intent.NONE}
                    helperText={passwordError ? passwordError : ""}
                    className="register-form-group"
                    labelInfo={t('required')}
                >
                    <InputGroup
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        autoComplete="new-password"
                        placeholder={t('password_placeholder')}
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
                    label={t('confirm_password')}
                    intent={confirmError ? Intent.DANGER : Intent.NONE}
                    helperText={confirmError  ? confirmError : ""}
                    className="register-form-group"
                    labelInfo={t('required')}
                >
                    <InputGroup
                        type={showConfPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        placeholder={t('password_confirm_placeholder')}
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
                <RadioGroup label={t('account_type')}
                            onChange={(e:any) => setUserType(e.target.value)}
                            selectedValue={userType}
                            inline={true}
                            className="register-radio-group"
                >
                    <Radio label={t('candidate_label')} value={CANDIDATE_ACCOUNT} />
                    <Radio label={t('employer_label')} value={EMPLOYER_ACCOUNT} />
                </RadioGroup>
            </form>
            <Button onClick={handleRegister}
                    small={true}
                    className="register-button"
            >
                {t('register_button')}
            </Button>
            </div>
            <div className="register-go-to-login">
                <Link to="login">
                    {t('register_go_to_login')} &#8594;
                </Link>
            </div>
        </div>
    );
};

export default RegisterPage;
