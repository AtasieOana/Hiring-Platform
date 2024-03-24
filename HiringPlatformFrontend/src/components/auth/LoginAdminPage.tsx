import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import "../styles/Login.css"
import {Button, FormGroup, InputGroup, Intent, Spinner, Text} from "@blueprintjs/core";
import {useTranslation} from "react-i18next";
import AuthenticationService from "../../services/authentication.service";
import {LoginResponse} from "../../types/auth.types";
import {AppToaster} from "../common/AppToaster";
import {useDispatch} from "react-redux";
import AdminService from "../../services/admin.service";
import {setAdminData} from "../../redux/actions/adminActions";
import HeaderAdminAuthPage from "../header/HeaderAdminAuth";

const LoginAdminPage = () => {

    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginInvalid, setLoginInvalid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email) || !password) {
            setLoginInvalid(true)
        } else {
            setIsLoading(true)
            AdminService.loginAdmin(email, password).then((response: any) => {
                let loginResponse: LoginResponse = response.data;
                if (loginResponse.token === '') {
                    setLoginInvalid(true)
                    setIsLoading(false)
                } else {
                    setLoginInvalid(false)
                    // Set admin in redux
                    dispatch(setAdminData(true, response.data.admin, response.data.token));
                    setIsLoading(false)
                    navigate("/allUsers")
                }
            }).catch((error) => {
                setIsLoading(false)
                console.error("Error during login: " + error.message);
                AppToaster.show({
                    message: t('login_error'),
                    intent: Intent.DANGER,
                });
            })
        }
    }
    
    let invalidLoginMessage = t('login_invalid')
    
    return (
        <div>
            <HeaderAdminAuthPage/>
            <div className="login-container">
            <div className="login-title">{t('as_admin')}</div>
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
                </form>
                {isLoading ? <Spinner className="central-spinner"
                                      size={20}/> :
                <Button onClick={handleLogin}
                        small={true}
                        className="login-button-admin"
                >
                    {t('login_button')}
                </Button>}
            </div>
            </div>
        </div>
    );
};

export default LoginAdminPage;
