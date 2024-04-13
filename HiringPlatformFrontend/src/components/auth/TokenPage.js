import React, {useEffect, useState} from 'react';
import {Button, FormGroup, InputGroup, Intent} from "@blueprintjs/core";
import {useNavigate, useParams} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import "../styles/Token.css"
import {AppToaster, AppToasterTop} from "../common/AppToaster";
import AuthenticationService from "../../services/authentication.service";
import HeaderAuth from "../header/HeaderAuth";

const TokenPage = () => {

    const {emailParam} = useParams();
    const {t} = useTranslation()
    const navigate = useNavigate();

    const [token, setToken] = useState('');
    const [tokenInvalid, setTokenInvalid] = useState(false);

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailParam)) {
            AppToasterTop.show({
                message: t('token_invalid_email'),
                intent: Intent.WARNING,
            });
            navigate('/register')
        }
    }, [])

    const handleTokenCheck = () => {
        if (token === '') {
            setTokenInvalid(true);
        } else {
            AuthenticationService.checkToken(emailParam, token).then((response) => {
                if (response.data) {
                    setTokenInvalid(false);
                    AppToasterTop.show({
                        message: t('token_success'),
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

    let invalidTokenMessage = t('token_invalid')

    return (
        <div>
            <HeaderAuth/>
            <div className="token-container">
                <div className="token-container-form">
                    <div className="login-title">{t('verify_account')}</div>
                    <div className="password-subtitle">
                        <span>{t('verify_helper1') + " "}</span>
                        <span className="password-subtitle-imp">{t('verify_helper2')}</span>
                    </div>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            handleTokenCheck()
                        }}>
                        <div className="token-forms">
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
                                label="Token"
                                intent={tokenInvalid ? Intent.DANGER : Intent.NONE}
                                helperText={tokenInvalid ? invalidTokenMessage : ""}
                                className="resPass-form-group"
                                labelInfo={"*"}
                            >
                                <InputGroup
                                    type="text"
                                    value={token}
                                    autoComplete="token"
                                    onChange={(e) => setToken(e.target.value)}
                                />
                            </FormGroup>
                        </div>
                        <Button onClick={handleTokenCheck}
                                small={true}
                                className="token-button"
                                type="submit"
                        >
                            {t('verify_button')}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TokenPage;
