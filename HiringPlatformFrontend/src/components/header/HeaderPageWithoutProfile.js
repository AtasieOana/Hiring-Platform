import React, {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Header.css';
import {
    Alignment,
    Button,
    Icon,
    Intent,
    Menu,
    MenuItem, Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Popover
} from '@blueprintjs/core';

import {useTranslation} from 'react-i18next';
import {AppToaster} from "../common/AppToaster";
import AuthenticationService from "../../services/authentication.service";
import {useDispatch, useSelector} from "react-redux";
import {setAuthData} from "../../redux/actions/authActions";
import {GBFlag, ROFlag, useMediaQuery} from "../common/CommonMethods";

const HeaderWithoutProfile = () => {

    const {t, i18n} = useTranslation();
    const employer = useSelector(state => state.auth.employer);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isSmallScreen = useMediaQuery("(max-width: 700px)");

    useEffect(() => {
        if(!employer || employer.employerId === ""){
            navigate("/login")
        }
    }, []);

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
                dispatch(setAuthData(false, null,null, ""));
                navigate("/login")
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
                                <MenuItem icon="chat" color="white"
                                          text={t('contact')} onClick={() => navigate('/contacts')}/>
                                <MenuItem icon="camera" color="white"
                                          text={t('profile')} onClick={() => navigate('/addProfile')}/>
                                <MenuItem icon="log-out" color="white" text={t('logout')} onClick={logout}/>
                            </Menu>
                        }
                        placement="bottom-end"
                    >
                        <Button minimal
                                icon={<Icon size={13} icon="mugshot" color="white" className="nav-icon"/>}
                                rightIcon={<Icon size={13} icon="chevron-down" color="white" className="nav-icon"/>}
                                text={employer?.companyName}
                                className="nav-button"
                        />
                    </Popover>
                </> : <>
                    <Button minimal
                        text={t('contact')}
                        onClick={()=>navigate("/contacts")}
                        className="nav-button"
                        icon={<Icon size={13} icon="chat" color="white" className="nav-icon"/>}
                    />
                    <NavbarDivider/>
                    <Button minimal
                            text={t('profile')}
                            onClick={()=>navigate("/addProfile")}
                            className="nav-button"
                            icon={<Icon size={13} icon="camera" color="white" className="nav-icon"/>}
                    />
                    <NavbarDivider/>
                    <Popover
                        interactionKind="hover"
                        content={
                            <Menu>
                                <MenuItem icon="log-out" color="white" text={t('logout')} onClick={logout}/>
                            </Menu>
                        }
                        position="bottom-right"
                    >
                        <Button minimal
                                icon={<Icon size={13} icon="mugshot" color="white" className="nav-icon"/>}
                                rightIcon={<Icon size={13} icon="chevron-down" color="white" className="nav-icon"/>}
                                text={employer?.companyName}
                                className="nav-button"
                        />
                    </Popover>
                </>
                }
            </NavbarGroup>
        </Navbar>
    );
};

export default HeaderWithoutProfile;
