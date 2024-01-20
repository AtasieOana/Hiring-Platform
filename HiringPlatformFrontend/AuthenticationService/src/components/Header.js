// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Header.css';
import {Icon} from "@blueprintjs/core";
import { useTranslation } from 'react-i18next';

const Header = () => {

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
                    <Icon size={14} icon="translate" color="white" className="nav-icon"/>  En/Ro
                </Link>
                <Link to="" className="nav-item">
                    <Icon size={14} icon="home" color="white" className="nav-icon"/> Home
                </Link>
                <Link to="login" className="nav-item">
                    <Icon size={14} icon="user" color="white" className="nav-icon"/> Login
                </Link>
                <Link to="register" className="nav-item">
                    <Icon size={14} icon="new-person" color="white" className="nav-icon"/> Register
                </Link>
            </div>
        </div>
    );
};

export default Header;
