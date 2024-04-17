// HeaderPageEmployer.js
import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Header.css';
import {
    Alignment,
    Button,
    Icon,
    Menu,
    MenuItem, Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Popover
} from "@blueprintjs/core";
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
        <Navbar className="header">
            <NavbarGroup align={Alignment.LEFT}>
                <NavbarHeading className="company-name">JOBLISTIC</NavbarHeading>
            </NavbarGroup>

            <NavbarGroup align={Alignment.RIGHT}  className="navigation">
                <Popover
                    interactionKind="hover"
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
                    <Button minimal
                            icon={<Icon size={13} icon={i18n.language === 'en' ? GBFlag() : ROFlag()} color="white" className="nav-icon"/>}
                            rightIcon={<Icon size={13} icon="chevron-down" color="white" className="nav-icon"/>}
                            text={i18n.language === 'en' ? 'English' : 'Română'}
                            className="nav-button"
                    />
                </Popover>
                <NavbarDivider />
                {isSmallScreen ? <>
                    <Popover
                        interactionKind="hover"
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
                        <Button minimal
                                rightIcon={<Icon size={13} icon="chevron-down" color="white" className="nav-icon"/>}
                                text={t('menu')}
                                className="nav-button"
                        />
                    </Popover>
                </> : <>
                    <Button minimal
                            text={t('about')}
                            onClick={()=>navigate("/")}
                            className="nav-button"
                            icon={<Icon size={13} icon="home" color="white" className="nav-icon"/>}
                    />
                    <NavbarDivider/>
                    <Button minimal
                            text={t('contact')}
                            onClick={()=>navigate("/contacts")}
                            className="nav-button"
                            icon={<Icon size={13} icon="chat" color="white" className="nav-icon"/>}
                    />
                    <NavbarDivider/>
                    <Button minimal
                            text={t('login')}
                            onClick={()=>navigate("/login")}
                            className="nav-button"
                            icon={<Icon size={13} icon="mugshot" color="white" className="nav-icon"/>}
                    />
                    <NavbarDivider/>
                    <Button minimal
                            text={t('register')}
                            onClick={()=>navigate("/register")}
                            className="nav-button"
                            icon={<Icon size={13} icon="new-person" color="white" className="nav-icon"/>}
                    />
                </>
                }
            </NavbarGroup>
        </Navbar>
    );
};

export default HeaderPage;
