// HeaderPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Header.css';
import {Icon} from "@blueprintjs/core";
import { useTranslation } from 'react-i18next';

const HeaderPage = () => {

    const { t, i18n } = useTranslation();

    // Change the language
    const changeLanguage = () => {
        let oldLanguage = i18n.language;
        const newLanguage = oldLanguage === 'ro' ? 'en' : 'ro';
        i18n.changeLanguage(newLanguage);
    };

    return (
        <div className="header">
            <div className="company-name">JOBLISTIC</div>

            <div className="navigation">
                <Link className="nav-item" to="" isActive={false} onClick={changeLanguage}>
                    <Icon size={13} icon="translate" color="white" className="nav-icon"/>  En/Ro
                </Link>
                <Link to="" className="nav-item">
                    <Icon size={13} icon="home" color="white" className="nav-icon"/> {t('about')}
                </Link>
                <Link to="login" className="nav-item">
                    <Icon size={13} icon="user" color="white" className="nav-icon"/> {t('login')}
                </Link>
                <Link to="register" className="nav-item">
                    <Icon size={13} icon="new-person" color="white" className="nav-icon"/> {t('register')}
                </Link>
            </div>
        </div>
    );
};

export default HeaderPage;
