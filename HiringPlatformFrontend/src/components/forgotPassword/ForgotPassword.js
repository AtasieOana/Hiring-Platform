import React, {useState} from 'react';
import {Button, FormGroup, InputGroup, Intent} from "@blueprintjs/core";
import {useNavigate} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import "../styles/ForgotPassword.css"
import AuthenticationService from "../../services/authentication.service";
import {AppToaster} from "../common/AppToaster";
import HeaderAuth from "../header/HeaderAuth";

const ForgotPasswordPage = () => {

    const {t} = useTranslation()
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [emailInvalid, setEmailInvalid] = useState(false);

    const handleEmailCheck = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailInvalid(true);
        } else {
            AuthenticationService.forgotPassword(email).then(() => {
                setEmailInvalid(false);
                navigate(`/resetPassword/${email}`);
            }).catch((error) => {
                console.error("Error during the reset of the password: " + error.message);
                AppToaster.show({
                    message: t('reset_error'),
                    intent: Intent.DANGER,
                });
            })
        }
    };

    let invalidEmailMessage = t('email_address_in')

    return (
        <div>
            <HeaderAuth/>
            <div className="password-container">
                <div className="password-container-form">
                    <div className="login-title">{t('password_title')}</div>
                    <div className="password-subtitle">
                        <p>{t('password_helper')}</p>
                        <p> {t('password_helper2')}</p>
                    </div>
                    <form onSubmit={e => {
                        e.preventDefault();
                        handleEmailCheck()
                    }}>
                        <div className="password-forms">
                            <FormGroup
                                label={t('email_address')}
                                intent={emailInvalid ? Intent.DANGER : Intent.NONE}
                                helperText={emailInvalid ? invalidEmailMessage : ""}
                                className="login-form-group"
                                labelInfo={"*"}
                            >
                                <InputGroup
                                    value={email}
                                    placeholder={t('email_placeholder')}
                                    autoComplete="new-email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    asyncControl={true}
                                />
                            </FormGroup>
                        </div>
                        <Button onClick={handleEmailCheck}
                                small={true}
                                className="reset-button"
                                type="submit"
                        >
                            {t('password_reset')}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
