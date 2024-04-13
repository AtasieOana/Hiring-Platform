import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Header.css';
import {Button, Dialog, DialogBody, DialogFooter, Icon, Intent, Menu, MenuItem, Popover} from '@blueprintjs/core';

import {useTranslation} from 'react-i18next';
import {AppToaster} from "../common/AppToaster";
import AuthenticationService from "../../services/authentication.service";
import {useDispatch, useSelector} from "react-redux";
import {GBFlag, ROFlag, useMediaQuery} from "../common/CommonMethods";
import {removeJobData} from "../../redux/actions/jobActions";
import {setAuthData} from "../../redux/actions/authActions";

const HeaderPageEmployer = () => {
    const {t, i18n} = useTranslation();
    const employer = useSelector(state => state.auth.employer);
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery("(max-width: 700px)");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const hasProfile = useSelector(state => state.profile.hasProfile);

    useEffect(() => {
        // Choose if the employer is redirect to profile creation or not
        if (isAuthenticated && employer && employer.employerId !== "") {
            if(!hasProfile){
                navigate("/addProfile")
            }
        } else {
            navigate("/login")
        }
    }, []);

    // Change the language
    const changeLanguage = () => {
        let oldLanguage = i18n.language;
        const newLanguage = oldLanguage === 'ro' ? 'en' : 'ro';
        i18n.changeLanguage(newLanguage);
    };

    const deleteAccount = () => {
        AuthenticationService.deleteAccount(employer.userDetails.email)
            .then(() => {
                navigate("/register");
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
                dispatch(removeJobData());
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
                                <MenuItem icon="list-detail-view" color="white" text={t('posted_jobs')}
                                          onClick={() => navigate('/allJobs')}/>
                                <MenuItem icon="annotation" color="white"
                                          text={t('edit_account')} onClick={handleGoToEditAccount}/>
                                <MenuItem icon="search-around" color="white" text={t('my_profile')}
                                          onClick={() => navigate('/profile')}/>
                                <MenuItem icon="helper-management" color="white"
                                          text={t('contact')} onClick={() => navigate('/contacts')}/>
                                <MenuItem icon="log-out" color="white" text={t('logout')} onClick={logout}/>
                                <MenuItem icon={<Icon size={13} icon="eraser" color="white" className="nav-icon"/>}
                                          className="delete-menu-item" color="white"
                                          text={t('delete_account')}
                                          onClick={handleDeleteAccount}/>
                            </Menu>
                        }
                        placement="bottom-end"
                    >
                        <Link className="nav-item nav-item-chevron" to="#" isActive={false}>
                            <Icon size={13} icon="mugshot" color="white" className="nav-icon"/> {employer?.companyName}
                            <Icon size={13} icon="chevron-down" color="white" className="nav-icon"/>
                        </Link>
                    </Popover>
                </> : <>
                    <Link className="nav-item" to="/allJobs">
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
                                <MenuItem icon="helper-management" color="white"
                                          text={t('contact')} onClick={() => navigate('/contacts')}/>
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

export default HeaderPageEmployer;
