// HeaderPage.js
import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css';
import {Icon, Intent} from "@blueprintjs/core";
import {useTranslation} from 'react-i18next';
import {AppToaster} from "../common/AppToaster";
import AuthenticationService from "../../services/authentication.service";

const HeaderPage = () => {

    const {t, i18n} = useTranslation();

    // Change the language
    const changeLanguage = () => {
        let oldLanguage = i18n.language;
        console.log(oldLanguage)
        const newLanguage = oldLanguage === 'ro' ? 'en' : 'ro';
        i18n.changeLanguage(newLanguage);
    };

    // Logout
    const logout = () => {
        AuthenticationService.logout()
            .then(() => {
                AppToaster.show({
                    message: t('logout_success'),
                    intent: Intent.SUCCESS,
                });
                window.location.replace('http://localhost:3000/login');
            })
            .catch(error => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('logout_err'),
                    intent: Intent.DANGER,
                });
            });
    };


    return (
        <div className="header">
            <div className="company-name">JOBLISTIC</div>

            <div className="navigation">
                <Link className="nav-item" to="#" isActive={false} onClick={changeLanguage}>
                    <Icon size={13} icon="translate" color="white" className="nav-icon"/> En/Ro
                </Link>
                <Link className="nav-item" to="#" isActive={false} onClick={logout}>
                    <Icon size={13} icon="log-out" color="white" className="nav-icon"/> {t('logout')}
                </Link>
            </div>
        </div>
    );
};

export default HeaderPage;
