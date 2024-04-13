import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {Button, Card, FormGroup, InputGroup, Intent} from "@blueprintjs/core";
import './EditAccount.css';
import {AppToaster} from "../common/AppToaster";
import AdminService from "../../services/admin.service";
import {setAdminData} from "../../redux/actions/adminActions";
import HeaderAdmin from "../header/HeaderAdmin";

const EditAccountPageAdmin = () => {

    const {t} = useTranslation();
    const admin = useSelector(state => state.admin.admin);
    const [isAccountEdited, setIsAccountEdited] = useState(false);
    const [accountInfo, setAccountInfo] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    })
    const [errorsAccount, setErrorsAccount] = useState({
        username: false,
        password: false,
        confirmPassword: false,
    });
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfPasswordVisibility = () => {
        setShowConfPassword(!showConfPassword);
    };

    useEffect(() => {
        setAccountInfo({
            username: admin.username,
            password: "",
            confirmPassword: "",
        })
    }, []);

    const handleAccountChange = (e) => {
        const {name, value} = e.target;
        setAccountInfo({...accountInfo, [name]: value});
    };

    const validateAccount = () => {
        let valid = true;
        const newErrors = {...errorsAccount};
        // Name validation
        const nameRegex = /^[a-zA-ZăâîșțĂÂÎȘȚ0-9\-& ]*$/;
        if (!accountInfo.username || accountInfo.username.length < 3 ||
            !nameRegex.test(accountInfo.username)) {
            newErrors.username = true;
            valid = false;
        } else {
            newErrors.username = false;
        }
        // Password validation
        if (accountInfo.password && accountInfo.password.length < 5) {
            newErrors.password = true;
            valid = false;
        } else {
            newErrors.password = false;
        }
        // Confirm password validation
        if (accountInfo.password !== accountInfo.confirmPassword) {
            newErrors.confirmPassword = true;
            valid = false;
        } else {
            newErrors.confirmPassword = false;
        }
        setErrorsAccount(newErrors);
        return valid;
    }

    const submitNewAccount = () => {
        if (validateAccount()) {
            let request = {
                userId: admin.adminId,
                newUsername: accountInfo.username,
                newPassword: accountInfo.password,
            }
            AdminService.editAdmin(request)
                .then((response) => {
                    let updateResponse = response.data;
                    AppToaster.show({
                        message: t('update_account_success'),
                        intent: Intent.SUCCESS,
                    });
                    dispatch(setAdminData(true, updateResponse.admin, updateResponse.token));
                    setIsAccountEdited(false)
                })
                .catch(error => {
                    console.log('Error: ', error.message);
                    AppToaster.show({
                        message: t('update_account_err'),
                        intent: Intent.DANGER,
                    });
                });
        }
    }

    const returnEditableAccountCard = () => {
        return <Card className="edit-profile-card-container">
            <div className="edit-profile-card-title-container">
                <div className="edit-profile-card-title">
                    {t('admin_info')}
                </div>
            </div>
            <div className="edit-profile-card-content">
                <form>
                    <div className="profile-fields-group">
                        <FormGroup
                            label={t('email_address')}
                            className="profile-field"
                            labelInfo={isAccountEdited ? t('read_only') : ""}
                        >
                            <InputGroup
                                value={admin.userDetails.email}
                                placeholder="mail@gmail.com"
                                autoComplete="new-mail"
                                asyncControl={true}
                                readOnly={true}
                            />
                        </FormGroup>
                        <FormGroup
                            label={t('username')}
                            className="profile-field"
                            intent={errorsAccount.username ? Intent.DANGER : Intent.NONE}
                            helperText={errorsAccount.username ? t('username_in') : ""}
                            labelInfo={isAccountEdited ? "*" : ""}
                        >
                            <InputGroup
                                type="text"
                                autoComplete="new-name"
                                value={accountInfo.username}
                                placeholder="Admin"
                                asyncControl={true}
                                name="username"
                                onChange={handleAccountChange}
                                readOnly={!isAccountEdited}
                            />
                        </FormGroup>
                    </div>
                    {
                        isAccountEdited && <div>
                            <div className="change-password-section-subtitle">
                                * {t('change_pass_condition')}
                            </div>
                        </div>
                    }
                    <div className="profile-fields-group">
                        <FormGroup
                            label={!isAccountEdited ? t('password') : t('new_password')}
                            intent={errorsAccount.password ? Intent.DANGER : Intent.NONE}
                            helperText={errorsAccount.password ? t('password_err') : ""}
                            className="profile-field"
                        >
                            <InputGroup
                                type={showPassword ? 'text' : 'password'}
                                value={isAccountEdited ? accountInfo.password : "*********************"}
                                name="password"
                                autoComplete="new-password"
                                placeholder={t('password_placeholder')}
                                onChange={handleAccountChange}
                                rightElement={
                                    isAccountEdited && <Button
                                        className="password-button"
                                        icon={showPassword ? 'eye-off' : 'eye-open'}
                                        minimal={true}
                                        onClick={togglePasswordVisibility}
                                        small={true}
                                        fill
                                        readOnly={!isAccountEdited}
                                    />
                                }
                                readOnly={!isAccountEdited}
                            />
                        </FormGroup>
                        {isAccountEdited && <FormGroup
                            label={t('confirm_password')}
                            intent={errorsAccount.confirmPassword ? Intent.DANGER : Intent.NONE}
                            helperText={errorsAccount.confirmPassword ? t('confirm_password_err') : ""}
                            className="profile-field"
                        >
                            <InputGroup
                                name="confirmPassword"
                                type={showConfPassword ? 'text' : 'password'}
                                value={accountInfo.confirmPassword}
                                placeholder={t('password_confirm_placeholder')}
                                autoComplete="new-password"
                                onChange={handleAccountChange}
                                rightElement={
                                <Button
                                    className="password-button"
                                    icon={showConfPassword ? 'eye-off' : 'eye-open'}
                                    minimal={true}
                                    onClick={toggleConfPasswordVisibility}
                                    small={true}
                                    fill
                                />
                            }
                            />
                        </FormGroup>
                        }
                    </div>
                    {isAccountEdited && <div className="edit-profile-actions">
                        <Button className="edit-profile-discard" onClick={()=>{
                            setAccountInfo({
                                username: admin.username,
                                password: "",
                                confirmPassword: "",
                            })
                            setErrorsAccount({
                                username: false,
                                password: false,
                                confirmPassword: false,
                            })
                            setIsAccountEdited(false)
                        }}>
                            {t('discard_changes')}
                        </Button>
                        <Button className="edit-profile-submit" onClick={()=> submitNewAccount()}>
                            {t('submit')}
                        </Button>
                    </div>
                    }
                </form>
            </div>
        </Card>
    }

    return (
        <div>
            <HeaderAdmin/>
            <div className="edit-account-container">
                <div className="edit-account-background">
                    <div className="edit-account-introduction">
                        <div className="edit-account-hello">
                            {t('hello')} {admin?.username}
                        </div>
                        <div className="edit-account-desc">
                            {t('account_desc_admin')}
                        </div>
                        <Button className="edit-profile-button"
                                onClick={() => {
                                    setIsAccountEdited(true);
                                    setShowPassword(false)
                                    setShowConfPassword(false)
                                    setAccountInfo({
                                        username: admin.username,
                                        password: "",
                                        confirmPassword: "",
                                    })
                                    setErrorsAccount({
                                        username: false,
                                        password: false,
                                        confirmPassword: false,
                                    })
                                }}
                                disabled={isAccountEdited}
                        >
                            {t('edit_profile')}
                        </Button>
                    </div>
                    <div className="edit-profile-card">
                        {returnEditableAccountCard()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAccountPageAdmin;
