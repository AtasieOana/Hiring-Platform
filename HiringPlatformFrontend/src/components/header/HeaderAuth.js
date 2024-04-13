// HeaderPageEmployer.js
import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import '../styles/HeaderAuth.css';
import {Icon, Menu, MenuItem, Popover} from "@blueprintjs/core";
import {useTranslation} from 'react-i18next';
import {ROFlag, GBFlag, useMediaQuery} from "../common/CommonMethods";

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
                <Popover
                    interactionKind="hover"
                    usePortal={false}
                    content={
                        <Menu className={"menu-language"}>
                            <MenuItem text="English" selected={i18n.language === 'en'}
                                      icon={GBFlag()}
                                      disabled={i18n.language === 'en'} onClick={() => changeLanguage()} />
                            <MenuItem text="Română" selected={i18n.language === 'ro'}
                                      icon={ROFlag()}
                                      disabled={i18n.language === 'ro'} onClick={() => changeLanguage()} />
                        </Menu>
                    }
                    position="bottom"
                >
                    <div className="nav-item-language">
                        <Icon size={13} icon={i18n.language === 'en' ? GBFlag() : ROFlag()} color="white" className="nav-icon"/> {i18n.language === 'en' ? 'English' : 'Română'}
                        <Icon size={13} icon="chevron-down" color="white" className="nav-icon"/>
                    </div>
                </Popover>
                {isSmallScreen ? <>
                    <Popover
                        interactionKind="hover"
                        usePortal={false}
                        content={
                            <Menu>
                                <MenuItem icon="home" color="white" text={t('about')}
                                          onClick={() => navigate('/')}/>
                                <MenuItem icon="chat" color="white"
                                          text={t('contact')} onClick={() => navigate('/contacts')}/>
                                <MenuItem icon="mugshot" color="white" text={t('login')}
                                          onClick={() => navigate('/login')}/>
                                <MenuItem icon="new-person"
                                          color="white"
                                          text={t('register')}
                                          onClick={() => navigate('/register')}/>
                            </Menu>
                        }
                        placement="bottom-end"
                    >
                        <Link className="nav-item-auth nav-item-chevron" to="#" isActive={false}>
                            <Icon size={13} icon="chevron-down" color="white" className="nav-icon"/> {t('menu')}
                        </Link>
                    </Popover>
                </> : <>
                    <Link to="/" className="nav-item-auth">
                        <Icon size={13} icon="home" color="white" className="nav-icon-auth"/> {t('about')}
                    </Link>
                    <Link to="/contacts" className="nav-item-auth">
                        <Icon size={13} icon="chat" color="white" className="nav-icon-auth"/> {t('contact')}
                    </Link>
                    <Link to="/login" className="nav-item-auth">
                        <Icon size={13} icon="mugshot" color="white" className="nav-icon-auth"/> {t('login')}
                    </Link>
                    <Link to="/register" activeClassName="active" className="nav-item-auth">
                        <Icon size={13} icon="new-person" color="white" className="nav-icon-auth"/> {t('register')}
                    </Link>
                </>
                }
            </div>
        </div>
    );
};

export default HeaderPage;
