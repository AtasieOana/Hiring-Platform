// HeaderPageEmployer.js
import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/HeaderAuth.css';
import {Icon} from "@blueprintjs/core";
import {useTranslation} from 'react-i18next';

const HeaderPage = () => {

    const {t, i18n} = useTranslation();

    // Change the language
    const changeLanguage = () => {
        let oldLanguage = i18n.language;
        const newLanguage = oldLanguage === 'ro' ? 'en' : 'ro';
        i18n.changeLanguage(newLanguage);
    };

    return (
        <div className="header-auth">
            <div className="company-name-auth">JOBLISTIC</div>

            <div className="navigation-auth">
                <Link className="nav-item-auth" to="#" isActive={false} onClick={changeLanguage}>
                    <Icon size={13} icon="translate" color="white" className="nav-icon-auth"/> En/Ro
                </Link>
                <Link to="/" className="nav-item-auth">
                    <Icon size={13} icon="home" color="white" className="nav-icon-auth"/> {t('about')}
                </Link>
                <Link to="/login" className="nav-item-auth">
                    <Icon size={13} icon="user" color="white" className="nav-icon-auth"/> {t('login')}
                </Link>
                <Link to="/register" className="nav-item-auth">
                    <Icon size={13} icon="new-person" color="white" className="nav-icon-auth"/> {t('register')}
                </Link>
            </div>
        </div>
    );
};

export default HeaderPage;
