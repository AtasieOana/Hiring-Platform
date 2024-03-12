import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css';
import {Icon, Intent, Menu, MenuItem, Popover} from '@blueprintjs/core';

import {useTranslation} from 'react-i18next';
import {AppToaster} from "../common/AppToaster";
import AuthenticationService from "../../services/authentication.service";
import {useSelector} from "react-redux";

const HeaderWithoutProfile = () => {

    const {t, i18n} = useTranslation();
    const employer = useSelector(state => state.auth.employer);

    // Change the language
    const changeLanguage = () => {
        let oldLanguage = i18n.language;
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
                <Popover
                    interactionKind="hover"
                    usePortal={false}
                    content={
                        <Menu>
                            <MenuItem icon="log-out" color="white" text={t('logout')} onClick={logout}/>
                        </Menu>
                    }
                    position="bottom-left"
                >
                    <Link className="nav-item" to="#" isActive={false}>
                        <Icon size={13} icon="mugshot" color="white" className="nav-icon"/> {employer?.companyName}
                        <Icon size={13} icon="chevron-down" color="white" className="nav-icon"/>
                    </Link>

                </Popover>
            </div>
        </div>
    );
};

export default HeaderWithoutProfile;
