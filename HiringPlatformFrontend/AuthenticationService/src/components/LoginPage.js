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

    const {t} = useTranslation()
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
                    //TODO - redirect page
                    setLoginInvalid(false)
                    console.log("A mers")
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
            console.log(response);
            let request: UserGoogleRequest = {};
            request.email = response.user.email;
            request.username = response.user.displayName;
            request.accountType = accountType;
            console.log(request)
            AuthenticationService.authGoogle((request)).then((response: any) => {
                console.log(response)
            }).catch((error) => {
                console.error("Error during authentication: " + error.message);
                AppToaster.show({
                    message: t('auth_error'),
                    intent: Intent.DANGER,
                });
            })
        } catch (error) {
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
            </div>
            <div className="login-go-to-register">
                <Link to="/register">
                    {t('login_go_to_register')} &#8594;
                </Link>
            </div>
            <button onClick={() => logGoogleUser(CANDIDATE_ACCOUNT)}>Sign In With Google As Candidate</button>
            <button onClick={() => logGoogleUser(EMPLOYER_ACCOUNT)}>Sign In With Google As Employer</button>

        </div>

    );
};

export default LoginPage;
