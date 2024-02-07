// HeaderPage.js
import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css';
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
        <div className="header">
            <div className="company-name">JOBLISTIC</div>

            <div className="navigation">
                <Link className="nav-item" to="#" isActive={false} onClick={changeLanguage}>
                    <Icon size={13} icon="translate" color="white" className="nav-icon"/> En/Ro
                </Link>
                TODOLOGOUT
            </div>
        </div>
    );
};

export default HeaderPage;
