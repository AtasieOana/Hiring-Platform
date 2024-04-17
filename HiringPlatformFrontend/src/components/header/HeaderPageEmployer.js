import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Header.css';
import {
    Alignment,
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    Icon,
    Intent,
    Menu,
    MenuItem, Navbar, NavbarDivider,
    NavbarGroup, NavbarHeading,
    Popover
} from '@blueprintjs/core';

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
                                <MenuItem icon="projects" color="white" text={t('posted_jobs')}
                                          onClick={() => navigate('/allJobs')}/>
                                <MenuItem icon="control" color="white"
                                          text={t('edit_account')} onClick={handleGoToEditAccount}/>
                                <MenuItem icon="inbox-geo" color="white" text={t('my_profile')}
                                          onClick={() => navigate('/profile')}/>
                                <MenuItem icon="chat" color="white"
                                          text={t('contact')} onClick={() => navigate('/contacts')}/>
                                <MenuItem icon="log-out" color="white" text={t('logout')} onClick={logout}/>
                                <MenuItem icon={<Icon size={14} icon="remove" color="white" className="nav-icon"/>}
                                          className="delete-menu-item" color="white"
                                          text={t('delete_account')}
                                          onClick={handleDeleteAccount}/>
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
                            text={t('posted_jobs')}
                            onClick={()=>navigate("/allJobs")}
                            className="nav-button"
                            icon={<Icon size={13} icon="projects" color="white" className="nav-icon"/>}
                    />
                    <NavbarDivider/>
                    <Button minimal
                            text={t('my_profile')}
                            onClick={()=>navigate("/profile")}
                            className="nav-button"
                            icon={<Icon size={13} icon="inbox-geo" color="white" className="nav-icon"/>}
                    />
                    <NavbarDivider/>
                    <Popover
                        interactionKind="hover"
                        content={
                            <Menu>
                                <MenuItem icon="control" color="white"
                                          text={t('edit_account')} onClick={handleGoToEditAccount}/>
                                <MenuItem icon="chat" color="white"
                                          text={t('contact')} onClick={() => navigate('/contacts')}/>
                                <MenuItem icon="log-out" color="white" text={t('logout')} onClick={logout}/>
                                <MenuItem icon={<Icon size={14} icon="remove" color="white" className="nav-icon"/>}
                                          className="delete-menu-item" color="white"
                                          text={t('delete_account')}
                                          onClick={handleDeleteAccount}/>
                            </Menu>
                        }
                        placement="bottom-end"
                        className="header-popover"
                    >
                        <Button minimal
                                icon={<Icon size={13} icon="mugshot" color="white" className="nav-icon"/>}
                                rightIcon={<Icon size={13} icon="chevron-down" color="white" className="nav-icon"/>}
                                text={employer?.companyName}
                                className="nav-button"
                        />
                    </Popover>
                </>}
            </NavbarGroup>
            {renderDeleteAccountDialog()}
        </Navbar>
    );
};

export default HeaderPageEmployer;
