import React, {useEffect, useState} from 'react';
import {Button, FormGroup, InputGroup, Intent} from "@blueprintjs/core";
import {useNavigate, useParams} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import "../styles/ResetPassword.css"
import {AppToaster, AppToasterTop} from "../common/AppToaster";
import AuthenticationService from "../../services/authentication.service";
import {ResetPasswordRequest} from "../../types/auth.types";
import HeaderAuth from "../header/HeaderAuth";

const ResetPassword = () => {

    const {emailParam} = useParams();
    const {t} = useTranslation()
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordInvalid, setPasswordInvalid] = useState(false);
    const [confirmPasswordInvalid, setConfirmPasswordInvalid] = useState(false);
    const [token, setToken] = useState('');
    const [tokenInvalid, setTokenInvalid] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfPasswordVisibility = () => {
        setShowConfPassword(!showConfPassword);
    };

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailParam || !emailRegex.test(emailParam)) {
            AppToasterTop.show({
                message: t('password_invalid_email'),
                intent: Intent.WARNING,
            });
            navigate('/register')
        }
    }, [])


    const handleTokenCheck = () => {
        setPasswordInvalid(!newPassword || newPassword.length < 5);
        setConfirmPasswordInvalid(newPassword !== confirmPassword);
        setTokenInvalid(token === '');
        if (newPassword && newPassword.length >= 5 && newPassword === confirmPassword && token !== '') {
            let request: ResetPasswordRequest = {email: "", newPassword: "", token: ""};
            request.newPassword = newPassword
            if (emailParam != null) {
                request.email = emailParam
            }
            request.token = token
            AuthenticationService.resetPassword(request).then((response: any) => {
                if (response.data) {
                    setTokenInvalid(false);
                    AppToasterTop.show({
                        message: t('password_success'),
                        intent: Intent.SUCCESS,
                    });
                    navigate("/login");
                } else {
                    setTokenInvalid(true);
                }
            }).catch((error) => {
                console.error("Error during checking the token: " + error.message);
                AppToaster.show({
                    message: t('token_error'),
                    intent: Intent.DANGER,
                });
            })
        }
    };

    let invalidPasswordMessage = t('password_len')
    let invalidConfirmMessage = t('password_confirm')
    let invalidTokenMessage = t('token_invalid')

    return (
        <div>
            <HeaderAuth/>
            <div className="resPass-container">
                <div className="resPass-title">{t('change_pass')}</div>
                <div className="password-subtitle">
                    <p>{t('reset_helper')}</p>
                    <p>{t('reset_helper2')}</p>
                </div>
                <div className="resPass-container-form">
                    <form className="resPass-forms">
                        <FormGroup
                            label={t('email_address')}
                            className="resPass-form-group"
                            labelInfo={t('autocompleted')}
                        >
                            <InputGroup
                                value={emailParam}
                                readOnly={true}
                                asyncControl={true}
                                autoComplete="new-email"
                            />
                        </FormGroup>
                        <FormGroup
                            label={t('password')}
                            intent={passwordInvalid ? Intent.DANGER : Intent.NONE}
                            helperText={passwordInvalid ? invalidPasswordMessage : ""}
                            className="register-form-group"
                            labelInfo={t('required')}
                        >
                            <InputGroup
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                autoComplete="new-password"
                                placeholder={t('password_placeholder')}
                                onChange={(e: any) => setNewPassword(e.target.value)}
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
                            intent={confirmPasswordInvalid ? Intent.DANGER : Intent.NONE}
                            helperText={confirmPasswordInvalid ? invalidConfirmMessage : ""}
                            className="register-form-group"
                            labelInfo={t('required')}
                        >
                            <InputGroup
                                type={showConfPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                placeholder={t('password_confirm_placeholder')}
                                autoComplete="new-password"
                                onChange={(e: any) => setConfirmPassword(e.target.value)}
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
                        <FormGroup
                            label="Token"
                            intent={tokenInvalid ? Intent.DANGER : Intent.NONE}
                            helperText={tokenInvalid ? invalidTokenMessage : ""}
                            className="register-form-group"
                        >
                            <InputGroup
                                type="text"
                                value={token}
                                autoComplete="token"
                                onChange={(e: any) => setToken(e.target.value)}
                            />
                        </FormGroup>
                    </form>
                    <Button onClick={handleTokenCheck}
                            small={true}
                            className="resPass-button"
                    >
                        {t('verify_button')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
