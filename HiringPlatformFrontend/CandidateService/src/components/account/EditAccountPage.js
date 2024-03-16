import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {Button, Card, Divider, Elevation, 
    FormGroup, Icon, InputGroup, Intent} from "@blueprintjs/core";
import './EditAccount.css';
import CandidateService from "../../services/candidate.service";
import {AppToaster} from "../common/AppToaster";
import {setAuthData} from "../../redux/actions/authActions";
import HeaderPage from "../header/HeaderPage";

const EditAccountPage = () => {

    const {t} = useTranslation();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const candidate = useSelector(state => state.auth.candidate);
    const [isAccountEdited, setIsAccountEdited] = useState(false);
    const [accountInfo, setAccountInfo] = useState({
        lastname: "",
        firstname: "",
        password: "",
        confirmPassword: "",
    })
    const [errorsAccount, setErrorsAccount] = useState({
        lastname: false,
        firstname: false,
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
        // Choose if the candidate is redirect to cv creation or not
        if (isAuthenticated) {
            setAccountInfo({
                lastname: candidate.lastname,
                firstname: candidate.firstname,
                password: "",
                confirmPassword: "",
            })
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
        const nameRegex = /^[a-zA-ZăâîșțĂÂÎȘȚ\- ]*$/;
        if (!accountInfo.lastname || !nameRegex.test(accountInfo.lastname)) {
            newErrors.lastname = true;
            valid = false;
        } else {
            newErrors.lastname = false;
        }
        if (!accountInfo.firstname || !nameRegex.test(accountInfo.firstname)) {
            newErrors.firstname = true;
            valid = false;
        } else {
            newErrors.firstname = false;
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
                email: candidate.userDetails.email,
                newFirstName: accountInfo.firstname,
                newLastName: accountInfo.lastname,
                newPassword: accountInfo.password,
            }
            console.log(request)
            CandidateService.updateAccount(request)
                .then((response) => {
                    let updateResponse = response.data;
                    AppToaster.show({
                        message: t('update_account_success'),
                        intent: Intent.SUCCESS,
                    });
                    dispatch(setAuthData(true, updateResponse.candidate, updateResponse.token));
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
                            value={candidate.userDetails.email}
                            placeholder="mail@gmail.com"
                            autoComplete="new-mail"
                            asyncControl={true}
                            readOnly={true}
                        />
                    </FormGroup>
                    <FormGroup
                        label={t('firstname')}
                        intent={errorsAccount.firstname ? Intent.DANGER : Intent.NONE}
                        helperText={errorsAccount.firstname ? t('firstname_err') : ""}
                        className="card-form-group"
                        labelInfo={t('required')}
                    >
                        <InputGroup
                            type="text"
                            name="firstname"
                            value={accountInfo.firstname}
                            placeholder="Maria"
                            autoComplete="new-user"
                            onChange={handleAccountChange}
                        />
                    </FormGroup>
                    <FormGroup
                        label={t('lastname')}
                        intent={errorsAccount.lastname ? Intent.DANGER : Intent.NONE}
                        helperText={errorsAccount.lastname ? t('lastname_err') : ""}
                        className="card-form-group"
                        labelInfo={t('required')}
                    >
                        <InputGroup
                            type="text"
                            name="lastname"
                            value={accountInfo.lastname}
                            placeholder="Popescu"
                            asyncControl={true}
                            onChange={handleAccountChange}
                        />
                    </FormGroup>
                    <div className="change-password-section-title">{t('change_pass')}</div>
                    <div className="change-password-section-subtitle">* {t('change_pass_condition')}
                    </div>
                    <div className="password-fields">
                        <FormGroup
                            label={t('new_password')}
                            intent={errorsAccount.password ? Intent.DANGER : Intent.NONE}
                            helperText={errorsAccount.password ? t('password_err') : ""}
                            className="card-form-group"
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
                <Button className="card-button" onClick={() => setIsAccountEdited(true)}>
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
                    <p className="card-info-content">{candidate.userDetails.email}</p>
                </FormGroup>
                <FormGroup
                    label={t('firstname') + ":"}
                    className="card-form-group-read"
                    inline={true}
                >
                    <p className="card-info-content">{candidate.firstname}</p>
                </FormGroup>
                <FormGroup
                    label={t('lastname') + ":"}
                    className="card-form-group-read"
                    inline={true}
                >
                    <p className="card-info-content">{candidate.lastname}</p>
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
