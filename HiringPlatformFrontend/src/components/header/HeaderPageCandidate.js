import React, {useEffect, useState} from 'react';
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

const HeaderPageCandidate = () => {
    const {t, i18n} = useTranslation();
    const candidate = useSelector(state => state.auth.candidate);
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery("(max-width: 700px)");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const dispatch = useDispatch();
    const hasCv = useSelector(state => state.cv.hasCv);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    useEffect(() => {
        // Choose if the candidate is redirect to CV creation or not
        if (isAuthenticated && candidate && candidate.candidateId !== "") {
            if(!hasCv){
                navigate("/addCv")
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
        AuthenticationService.deleteAccount(candidate.userDetails.email)
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
                <Link className="nav-item" to="#" isActive={false} onClick={changeLanguage}>
                    <Icon size={13} icon="translate" color="white" className="nav-icon"/> En/Ro
                </Link>
                {isSmallScreen ? <>
                    <Popover
                        interactionKind="hover"
                        usePortal={false}
                        content={
                            <Menu>
                                <MenuItem icon="print" color="white" text={t('my_resumes')}
                                          onClick={() => navigate('/allCv')}/>
                                <MenuItem icon="annotation" color="white"
                                          text={t('edit_account')} onClick={handleGoToEditAccount}/>
                                <MenuItem icon="search-around" color="white" text={t('jobs')}
                                          onClick={() => navigate('/allJobs')}/>
                                <MenuItem icon="helper-management" color="white"
                                          text={t('contact')} onClick={() => navigate('/contacts')}/>
                                <MenuItem icon="paperclip" color="white" text={t('my_apps')}
                                          onClick={() => navigate('/applications')}/>
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
                            <Icon size={13} icon="mugshot" color="white" className="nav-icon"/> {candidate?.lastname + " " + candidate?.firstname}
                            <Icon size={13} icon="chevron-down" color="white" className="nav-icon"/>
                        </Link>
                    </Popover>
                </> : <>
                    <Link className="nav-item" to="/allJobs">
                        <Icon size={13} icon="search-around" color="white" className="nav-icon"/> {t('jobs')}
                    </Link>
                    <Link className="nav-item" to="/applications">
                        <Icon size={13} icon="paperclip" color="white" className="nav-icon"/> {t('my_apps')}
                    </Link>
                    <Link className="nav-item" to="/allCv">
                        <Icon size={13} icon="print" color="white" className="nav-icon"/> {t('my_resumes')}
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
                            <Icon size={13} icon="mugshot" color="white" className="nav-icon"/> {candidate?.lastname + " " + candidate?.firstname}
                            <Icon size={13} icon="chevron-down" color="white" className="nav-icon"/>
                        </Link>
                    </Popover>
                </>}
                {renderDeleteAccountDialog()}
            </div>
        </div>
    );
};

export default HeaderPageCandidate;
