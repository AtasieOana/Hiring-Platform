import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {Button, Card, Divider, FormGroup, Icon, InputGroup, Intent} from "@blueprintjs/core";
import './EditAccount.css';
import HeaderPageEmployer from "../header/HeaderPageEmployer";
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

    const submitNewAccount = (e) => {
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
        return <Card className="card-container">
            <div className="card-title-container">
                <div className="card-title">
                    <Icon size={16} icon="heatmap" color="#698576" className="nav-icon"/>
                    {t('edit_account_information')}
                    <Icon size={16} icon="heatmap" color="#698576" className="nav-icon"/>
                </div>
                <Button className="card-button" onClick={submitNewAccount}>
                    {t('submit')}
                </Button>
            </div>
            <Divider/>
            <div className="card-content">
                <form>
                    <FormGroup
                        label={t('email_address')}
                        className="card-form-group"
                        labelInfo={t('autocompleted')}
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
                        className="card-form-group"
                        intent={errorsAccount.username ? Intent.DANGER : Intent.NONE}
                        helperText={errorsAccount.username ? t('username_in') : ""}
                        labelInfo={t('required')}
                    >
                        <InputGroup
                            type="text"
                            autoComplete="new-name"
                            value={accountInfo.username}
                            placeholder="Joblistic"
                            asyncControl={true}
                            name="username"
                            onChange={handleAccountChange}
                        />
                    </FormGroup>
                    <div className="change-password-section-title">{t('change_pass')}</div>
                    <div className="change-password-section-subtitle">* {t('change_pass_condition')}
                    </div>
                    <div className="password-fields">
                        <FormGroup
                            label={t('password')}
                            intent={errorsAccount.password ? Intent.DANGER : Intent.NONE}
                            helperText={errorsAccount.password ? t('password_err') : ""}
                            className="card-form-group"
                            labelInfo={t('required')}
                        >
                            <InputGroup
                                type={showPassword ? 'text' : 'password'}
                                value={accountInfo.password}
                                name="password"
                                autoComplete="new-password"
                                placeholder={t('password_placeholder')}
                                onChange={handleAccountChange}
                                rightElement={
                                    <Button
                                        className="password-button"
                                        icon={showPassword ? 'eye-off' : 'eye-open'}
                                        minimal={true}
                                        onClick={togglePasswordVisibility}
                                        small={true}
                                        fill
                                    />
                                }
                            />
                        </FormGroup>
                        <FormGroup
                            label={t('confirm_password')}
                            intent={errorsAccount.confirmPassword ? Intent.DANGER : Intent.NONE}
                            helperText={errorsAccount.confirmPassword ? t('confirm_password_err') : ""}
                            className="card-form-group"
                            labelInfo={t('required')}
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
                    </div>
                </form>
            </div>
        </Card>
    }

    const returnReadOnlyAccountCard = () => {
        return <Card className="card-container">
            <div className="card-title-container">
                <div className="card-title">
                    <Icon size={16} icon="heatmap" color="#698576" className="nav-icon"/>
                    {t('account_information')}
                    <Icon size={16} icon="heatmap" color="#698576" className="nav-icon"/>
                </div>
                <Button className="card-button" onClick={() => {
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
                }}>
                    {t('edit_information')}
                </Button>
            </div>
            <Divider/>
            <div className="card-content">
                <FormGroup
                    label={t('email_address') + ":"}
                    className="card-form-group-read"
                    inline={true}
                >
                    <p className="card-info-content">{admin.userDetails.email}</p>
                </FormGroup>
                <FormGroup
                    label={t('username') + ":"}
                    className="card-form-group-read"
                    inline={true}
                >
                    <p className="card-info-content">{admin.username}</p>
                </FormGroup>
                <FormGroup
                    label={t('password') + ":"}
                    className="card-form-group-read"
                    inline={true}
                >
                    <p className="card-info-content">******</p>
                </FormGroup>
            </div>
        </Card>
    }

    return (
        <div>
            <HeaderAdmin/>
            <div className="edit-account-subtitle">
                {t('edit_account_subtitle_admin')}
            </div>
            <div className="edit-card">
                {isAccountEdited ? returnEditableAccountCard() : returnReadOnlyAccountCard()}
            </div>
        </div>
    );
};

export default EditAccountPageAdmin;
