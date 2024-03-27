// HeaderPageEmployer.js
import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import '../styles/HeaderAuth.css';
import {Icon, Menu, MenuItem, Popover} from "@blueprintjs/core";
import {useTranslation} from 'react-i18next';
import {useMediaQuery} from "../common/CommonMethods";

const HeaderPage = () => {

    const {t, i18n} = useTranslation();
    const isSmallScreen = useMediaQuery("(max-width: 700px)");
    const navigate = useNavigate();

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
                {isSmallScreen ? <>
                    <Popover
                        interactionKind="hover"
                        usePortal={false}
                        content={
                            <Menu>
                                <MenuItem icon="home" color="white" text={t('about')}
                                          onClick={() => navigate('/')}/>
                                <MenuItem icon="helper-management" color="white"
                                          text={t('contact')} onClick={() => navigate('/contacts')}/>
                                <MenuItem icon="user" color="white" text={t('login')}
                                          onClick={() => navigate('/login')}/>
                                <MenuItem icon="new-person"
                                          color="white"
                                          text={t('register')}
                                          onClick={() => navigate('/register')}/>
                            </Menu>
                        }
                        placement="bottom-end"
                    >
                        <Link className="nav-item" to="#" isActive={false}>
                            <Icon size={13} icon="chevron-down" color="white" className="nav-icon"/>
                        </Link>
                    </Popover>
                </> : <>
                    <Link to="/" className="nav-item-auth">
                        <Icon size={13} icon="home" color="white" className="nav-icon-auth"/> {t('about')}
                    </Link>
                    <Link to="/contacts" className="nav-item-auth">
                        <Icon size={13} icon="helper-management" color="white" className="nav-icon-auth"/> {t('contact')}
                    </Link>
                    <Link to="/login" className="nav-item-auth">
                        <Icon size={13} icon="user" color="white" className="nav-icon-auth"/> {t('login')}
                    </Link>
                    <Link to="/register" className="nav-item-auth">
                        <Icon size={13} icon="new-person" color="white" className="nav-icon-auth"/> {t('register')}
                    </Link>
                </>
                }
            </div>
        </div>
    );
};

export default HeaderPage;
