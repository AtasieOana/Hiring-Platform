import React, {useEffect, useState} from 'react';
import HeaderPage from "./header/HeaderPage";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import ProfileService from "../services/profile.service";
import {AppToaster} from "./common/AppToaster";
import {Button, Card, Divider, Elevation, FormGroup, Icon, InputGroup, Intent} from "@blueprintjs/core";
import './EditAccount.css';
import {setAuthData} from "../redux/actions/authActions";

const EditAccountPage = () => {

    const {t} = useTranslation();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const employer = useSelector(state => state.auth.employer);
    const navigate = useNavigate();
    const [isAccountEdited, setIsAccountEdited] = useState(false);
    const [accountInfo, setAccountInfo] = useState({
        companyName: "",
        password: "",
        confirmPassword: "",
    })
    const [errorsAccount, setErrorsAccount] = useState({
        companyName: false,
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
        // Choose if the employer is redirect to profile creation or not
        if (isAuthenticated) {
            ProfileService.hasEmployerProfile(employer.userDetails.email)
                .then((response) => {
                    if (response.data === false) {
                        navigate('/ro');
                    }
                    setAccountInfo({
                        companyName: employer.companyName,
                        password: employer.userDetails.password || "",
                        confirmPassword: employer.userDetails.password || "",
                    })
                })
                .catch(error => {
                    console.error('Error: ', error.message);
                    AppToaster.show({
                        message: t('profile_err'),
                        intent: Intent.DANGER,
                    });
                    window.location.replace('http://localhost:3000/login');
                });
        } else {
            window.location.replace('http://localhost:3000/login');
        }
    }, []);

    const handleAccountChange = (e) => {
        const {name, value} = e.target;
        setAccountInfo({...accountInfo, [name]: value});
    };

    const validateAccount = () => {
        let valid = true;
        const newErrors = {...errorsAccount};
        // Name validation
        const nameRegex = /^[a-zA-Z0-9\-& ]*$/;
        if (!accountInfo.companyName || accountInfo.companyName.length < 3 ||
            !nameRegex.test(accountInfo.companyName)) {
            newErrors.companyName = true;
            valid = false;
        } else {
            newErrors.companyName = false;
        }
        // Password validation
        if (employer.userDetails.password === null && accountInfo.password === "") {
            newErrors.password = false;
        } else if (!accountInfo.password || accountInfo.password.length < 5) {
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
                email: employer.userDetails.email,
                newCompanyName: accountInfo.companyName,
                newPassword: accountInfo.password,
            }
            ProfileService.updateAccount(request)
                .then((response) => {
                    let updateResponse = response.data;
                    AppToaster.show({
                        message: t('update_account_success'),
                        intent: Intent.SUCCESS,
                    });
                    dispatch(setAuthData(true, updateResponse.employer, updateResponse.token));
                    setIsAccountEdited(false)
                })
                .catch(error => {
                    console.error('Error: ', error.message);
                    AppToaster.show({
                        message: t('update_account_err'),
                        intent: Intent.DANGER,
                    });
                });
        }
    }

    const returnEditableAccountCard = () => {
        return <Card interactive={true} elevation={Elevation.TWO} className="card-container">
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
                            value={employer.userDetails.email}
                            placeholder="mail@gmail.com"
                            autoComplete="new-mail"
                            asyncControl={true}
                            readOnly={true}
                        />
                    </FormGroup>
                    <FormGroup
                        label={t('company')}
                        className="card-form-group"
                        intent={errorsAccount.companyName ? Intent.DANGER : Intent.NONE}
                        helperText={errorsAccount.companyName ? t('company_err') : ""}
                        labelInfo={t('required')}
                    >
                        <InputGroup
                            type="text"
                            autoComplete="new-name"
                            value={accountInfo.companyName}
                            placeholder="Joblistic"
                            asyncControl={true}
                            name="companyName"
                            onChange={handleAccountChange}
                        />
                    </FormGroup>
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
        return <Card interactive={true} elevation={Elevation.TWO} className="card-container">
            <div className="card-title-container">
                <div className="card-title">
                    <Icon size={16} icon="heatmap" color="#698576" className="nav-icon"/>
                    {t('account_information')}
                    <Icon size={16} icon="heatmap" color="#698576" className="nav-icon"/>
                </div>
                <Button className="card-button" onClick={() => setIsAccountEdited(true)}>
                    {t('edit_information')}
                </Button>
            </div>
            <Divider/>
            <div className="card-content">
                <FormGroup
                    label={t('email_address') + ":"}
                    className="card-form-group"
                >
                    <p className="card-info-content">{employer.userDetails.email}</p>
                </FormGroup>
                <FormGroup
                    label={t('company') + ":"}
                    className="card-form-group"
                >
                    <p className="card-info-content">{employer.companyName}</p>
                </FormGroup>
                <FormGroup
                    label={t('password') + ":"}
                    className="card-form-group"
                >
                    <p className="card-info-content">{employer.userDetails.password === "" || employer.userDetails.password === null
                        ? t('empty_pass_motivation') : employer.userDetails.password.replace(/./g, '*')}</p>
                </FormGroup>
            </div>
        </Card>
    }

    return (
        <div>
            <HeaderPage/>
            <div className="edit-account-subtitle">
                {t('edit_account_subtitle')}
            </div>
            <div className="edit-card">
                {isAccountEdited ? returnEditableAccountCard() : returnReadOnlyAccountCard()}
            </div>
        </div>
    );
};

export default EditAccountPage;
