import React, {useEffect, useState} from 'react';
import {Button, FormGroup, InputGroup, Intent} from "@blueprintjs/core";
import {useNavigate, useParams} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import "./styles/Token.css"
import AuthenticationService from "../services/authentication.service";
import {AppToaster, AppToasterTop} from "./common/AppToaster";

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
            AuthenticationService.checkToken(emailParam, token).then((response: any) => {
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
        <div className="token-container">
            <div className="token-title">{t('verify_account')}</div>
            <div className="token-container-form">
                <form className="token-forms">
                    <FormGroup
                        label={t('email_address')}
                        className="token-form-group"
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
                        className="token-button"
                >
                    {t('verify_button')}
                </Button>
            </div>
        </div>
    );
};

export default TokenPage;
