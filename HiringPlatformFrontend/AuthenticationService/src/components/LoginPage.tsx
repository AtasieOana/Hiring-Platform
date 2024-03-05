import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import "./styles/Login.css"
import {Button, FormGroup, InputGroup, Intent, Text} from "@blueprintjs/core";
import {useTranslation} from "react-i18next";
import AuthenticationService from "../services/authentication.service";
import {AppToaster} from "./common/AppToaster";
import {LoginResponse, UserGoogleRequest} from "../types/auth.types";
import {signInWithGooglePopup} from "./google/firebase.utils";
import {CANDIDATE_ACCOUNT, EMPLOYER_ACCOUNT} from "../util/constants";

const LoginPage = () => {

    const {t, i18n} = useTranslation();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginInvalid, setLoginInvalid] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email) || !password) {
            setLoginInvalid(true)
        } else {
            AuthenticationService.login(email, password).then((response: any) => {
                let loginResponse: LoginResponse = response.data;
                if (loginResponse.token === '') {
                    setLoginInvalid(true)
                } else {
                    setLoginInvalid(false)
                    let url = "";
                    if (loginResponse.roleName === CANDIDATE_ACCOUNT) {
                        console.log("TODO - CANDIDAT")
                    } else if (loginResponse.roleName === EMPLOYER_ACCOUNT) {
                        url = 'http://localhost:3001'
                    } else {
                        console.log("TODO - ADMIN")
                    }
                    const paramLanguage = i18n.language;
                    if (paramLanguage) {
                        url += `/${paramLanguage}`;
                    }
                    window.location.href = url;
                }
            }).catch((error) => {
                console.error("Error during login: " + error.message);
                AppToaster.show({
                    message: t('login_error'),
                    intent: Intent.DANGER,
                });
            })
        }
    }

    const goToForgetPassword = () => {
        navigate('/forgotPassword');
    }

    let invalidLoginMessage = t('login_invalid')

    const logGoogleUser = async (accountType: string) => {
        try {
            const response = await signInWithGooglePopup();
            let request: UserGoogleRequest = {} as UserGoogleRequest;
            if (response.user.email != null && response.user.displayName != null) {
                request.email = response.user.email;
                request.name = response.user.displayName;
                request.accountType = accountType;
                [request.givenName, request.familyName] = response.user.displayName.split(' ');
            }
            AuthenticationService.loginGoogle((request)).then((response: any) => {
                if (response.data.token === "") {
                    setLoginInvalid(true)
                } else {
                    setLoginInvalid(false)
                    let url = "";
                    if (response.data.roleName === CANDIDATE_ACCOUNT) {
                        console.log("TODO - CANDIDAT")
                    } else if (response.data.roleName === EMPLOYER_ACCOUNT) {
                        url = 'http://localhost:3001'
                    } else {
                        console.log("TODO - ADMIN")
                    }
                    const paramLanguage = i18n.language;
                    if (paramLanguage) {
                        url += `/${paramLanguage}`;
                    }
                    window.location.href = url;
                }
            }).catch((error) => {
                console.error("Error during authentication: " + error.message);
                AppToaster.show({
                    message: t('login_error'),
                    intent: Intent.DANGER,
                });
            })
        } catch (error: any) {
            console.error("Error during login: " + error.message);
            AppToaster.show({
                message: t('login_error'),
                intent: Intent.DANGER,
            });
        }
    }

    return (
        <div className="login-container">
            <div className="login-title">{t('login_to')} Joblistic!</div>
            <div className="login-container-form">
                <form className="login-forms">
                    <FormGroup
                        label={t('email_address')}
                        className="login-form-group"
                        labelInfo={t('required')}
                    >
                        <InputGroup
                            value={email}
                            placeholder="mail@gmail.com"
                            autoComplete="new-email"
                            onChange={(e: any) => setEmail(e.target.value)}
                            asyncControl={true}
                        />
                    </FormGroup>
                    <FormGroup
                        label={t('password')}
                        intent={loginInvalid ? Intent.DANGER : Intent.NONE}
                        helperText={loginInvalid ? invalidLoginMessage : ""}
                        className="login-form-group"
                        labelInfo={t('required')}
                    >
                        <InputGroup
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            autoComplete="new-password"
                            placeholder={t('password_placeholder')}
                            onChange={(e: any) => setPassword(e.target.value)}
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
                    <div className="forgot-password">
                        <Text onClick={goToForgetPassword}>
                            {t('password_title')}
                        </Text>
                    </div>
                </form>
                <Button onClick={handleLogin}
                        small={true}
                        className="login-button"
                >
                    {t('login_button')}
                </Button>
                <div className="text-or">
                    OR
                </div>
                <Button className="register-button"
                        small={true}
                        onClick={() => logGoogleUser(EMPLOYER_ACCOUNT)}>
                    {t('sign_google')}
                </Button>
            </div>
            <div className="login-go-to-register">
                <Link to="/register">
                    {t('login_go_to_register')} &#8594;
                </Link>
            </div>
        </div>

    );
};

export default LoginPage;
