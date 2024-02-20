import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Header.css';
import {Button, Dialog, DialogBody, DialogFooter, Icon, Intent, Menu, MenuItem, Popover} from '@blueprintjs/core';

import {useTranslation} from 'react-i18next';
import {AppToaster} from "../common/AppToaster";
import AuthenticationService from "../../services/authentication.service";
import {useSelector} from "react-redux";

const HeaderPage = () => {

    function useMediaQuery(query) {
        const [matches, setMatches] = useState(false);

        useEffect(() => {
            const mediaQuery = window.matchMedia(query);
            setMatches(mediaQuery.matches);

            const handler = (event) => setMatches(event.matches);
            mediaQuery.addListener(handler);

            return () => mediaQuery.removeListener(handler);
        }, [query]);

        return matches;
    }

    const {t, i18n} = useTranslation();
    const employer = useSelector(state => state.auth.employer);
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery("(max-width: 700px)");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Change the language
    const changeLanguage = () => {
        let oldLanguage = i18n.language;
        console.log(oldLanguage)
        const newLanguage = oldLanguage === 'ro' ? 'en' : 'ro';
        i18n.changeLanguage(newLanguage);
    };

    const deleteAccount = () => {
        AuthenticationService.deleteAccount(employer.userDetails.email)
            .then(() => {
                window.location.replace('http://localhost:3000/register');
            })
            .catch(error => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('delete_err'),
                    intent: Intent.DANGER,
                });
            });
    }

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

    const handleGoToEditAccount = () => {
        navigate('/editAccount');
    }

    const handleDeleteAccount = () => {
        setIsDeleteDialogOpen(true);
    }

    const renderDeleteAccountDialog = () => {
        return <Dialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            title={t('confirm_account_delete')}
        >
            <DialogBody useOverflowScrollContainer={false}>
                <p>{t('message_account_delete')}</p>
                <DialogFooter minimal={true} actions={<div>
                    <Button intent="danger" onClick={deleteAccount}>{t('delete')}</Button>
                    <Button onClick={() => setIsDeleteDialogOpen(false)}>{t('cancel')}</Button>
                </div>}/>
            </DialogBody>
        </Dialog>
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
                                <MenuItem icon="list-detail-view" color="white" text={t('posted_jobs')}
                                          onClick={() => navigate('/home')}/>
                                <MenuItem icon="annotation" color="white"
                                          text={t('edit_account')} onClick={handleGoToEditAccount}/>
                                <MenuItem icon="search-around" color="white" text={t('my_profile')}
                                          onClick={() => navigate('/profile')}/>
                                <MenuItem icon="log-out" color="white" text={t('logout')} onClick={logout}/>
                                <MenuItem icon={<Icon size={13} icon="eraser" color="white" className="nav-icon"/>}
                                          className="delete-menu-item" color="white"
                                          text={t('delete_account')}
                                          onClick={handleDeleteAccount}/>
                            </Menu>
                        }
                        placement="bottom-end"
                    >
                        <Link className="nav-item" to="#" isActive={false}>
                            <Icon size={13} icon="mugshot" color="white" className="nav-icon"/> {employer?.companyName}
                            <Icon size={13} icon="chevron-down" color="white" className="nav-icon"/>
                        </Link>
                    </Popover>
                </> : <>
                    <Link className="nav-item" to="/home">
                        <Icon size={13} icon="list-detail-view" color="white" className="nav-icon"/> {t('posted_jobs')}
                    </Link>
                    <Link className="nav-item" to="/profile">
                        <Icon size={13} icon="search-around" color="white" className="nav-icon"/> {t('my_profile')}
                    </Link>
                    <Popover
                        interactionKind="hover"
                        usePortal={false}
                        content={
                            <Menu>
                                <MenuItem icon="annotation" color="white"
                                          text={t('edit_account')} onClick={handleGoToEditAccount}/>
                                <MenuItem icon="log-out" color="white" text={t('logout')} onClick={logout}/>
                                <MenuItem icon={<Icon size={13} icon="eraser" color="white" className="nav-icon"/>}
                                          className="delete-menu-item" color="white"
                                          text={t('delete_account')}
                                          onClick={handleDeleteAccount}/>
                            </Menu>
                        }
                        placement="bottom-end"
                    >
                        <Link className="nav-item" to="#" isActive={false}>
                            <Icon size={13} icon="mugshot" color="white" className="nav-icon"/> {employer?.companyName}
                            <Icon size={13} icon="chevron-down" color="white" className="nav-icon"/>
                        </Link>
                    </Popover>
                </>}
                {renderDeleteAccountDialog()}
            </div>
        </div>
    );
};

export default HeaderPage;
