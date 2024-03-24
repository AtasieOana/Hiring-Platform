import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Header.css';
import {Button, Dialog, DialogBody, DialogFooter, Icon, Intent, Menu, MenuItem, Popover} from '@blueprintjs/core';

import {useTranslation} from 'react-i18next';
import {AppToaster} from "../common/AppToaster";
import AuthenticationService from "../../services/authentication.service";
import {useDispatch, useSelector} from "react-redux";
import {useMediaQuery} from "../common/CommonMethods";
import {removeJobData} from "../../redux/actions/jobActions";
import {setAuthData} from "../../redux/actions/authActions";
import {setAdminData} from "../../redux/actions/adminActions";

const HeaderPageAdmin = () => {
    const {t, i18n} = useTranslation();
    const admin = useSelector(state => state.admin.admin);
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery("(max-width: 700px)");
    const dispatch = useDispatch();

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
                dispatch(setAdminData(false, null,""));
                navigate("/loginAdmin")
            })
            .catch(error => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('logout_err'),
                    intent: Intent.DANGER,
                });
            });
    };

    const handleGoToEditAccount = () => {
        navigate('/editAccount');
    }

    return (
        <div className="header">
            <div className="company-name">JOBLISTIC</div>

            <div className="navigation">
                <Link className="nav-item" to="#" isActive={false} onClick={changeLanguage}>
                    <Icon size={13} icon="translate" color="white" className="nav-icon"/> En/Ro
                </Link>
                {isSmallScreen ? <>
                    <Popover
                        interactionKind="hover"
                        usePortal={false}
                        content={
                            <Menu>
                                <MenuItem icon="people" color="white" text={t('allUsers')}
                                          onClick={() => navigate('/allUsers')}/>
                                <MenuItem icon="take-action" color="white" text={t('reports')}
                                          onClick={() => navigate('/complains')}/>
                                <MenuItem icon="chart" color="white" text={t('activities')}
                                          onClick={() => navigate('/activities')}/>
                                <MenuItem icon="annotation" color="white"
                                          text={t('edit_account')} onClick={handleGoToEditAccount}/>
                                <MenuItem icon="log-out" color="white" text={t('logout')} onClick={logout}/>
                            </Menu>
                        }
                        placement="bottom-end"
                    >
                        <Link className="nav-item" to="#" isActive={false}>
                            <Icon size={13} icon="mugshot" color="white" className="nav-icon"/> {admin?.username}
                            <Icon size={13} icon="chevron-down" color="white" className="nav-icon"/>
                        </Link>
                    </Popover>
                </> : <>
                    <Link className="nav-item" to="/allUsers">
                        <Icon size={13} icon="people" color="white" className="nav-icon"/> {t('allUsers')}
                    </Link>
                    <Link className="nav-item" to="/complains">
                        <Icon size={13} icon="take-action" color="white" className="nav-icon"/> {t('reports')}
                    </Link>
                    <Link className="nav-item" to="/activities">
                        <Icon size={13} icon="chart" color="white" className="nav-icon"/> {t('activities')}
                    </Link>
                    <Popover
                        interactionKind="hover"
                        usePortal={false}
                        content={
                            <Menu>
                                <MenuItem icon="annotation" color="white"
                                          text={t('edit_account')} onClick={handleGoToEditAccount}/>
                                <MenuItem icon="log-out" color="white" text={t('logout')} onClick={logout}/>
                            </Menu>
                        }
                        placement="bottom-end"
                    >
                        <Link className="nav-item" to="#" isActive={false}>
                            <Icon size={13} icon="mugshot" color="white" className="nav-icon"/> {admin?.username}
                            <Icon size={13} icon="chevron-down" color="white" className="nav-icon"/>
                        </Link>
                    </Popover>
                </>}
            </div>
        </div>
    );
};

export default HeaderPageAdmin;
