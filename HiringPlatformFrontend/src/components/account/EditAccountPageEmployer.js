import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {Button, Card, FormGroup, InputGroup, Intent} from "@blueprintjs/core";
import './EditAccount.css';
import HeaderPageEmployer from "../header/HeaderPageEmployer";
import {AppToaster} from "../common/AppToaster";
import {setAuthData} from "../../redux/actions/authActions";
import EmployerService from "../../services/employer.service";
import EmployerApplicationsPerDayChart from "./chart/EmployerApplicationsPerDayChart";
import EmployerApplicationsPerJobChart from "./chart/EmployerApplicationsPerJobChart";
import EmployerApplicationsStatusChart from "./chart/EmployerApplicationsStatusChart";


const EditAccountPageEmployer = () => {

    const {t} = useTranslation();
    const employer = useSelector(state => state.auth.employer);
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
        setAccountInfo({
            companyName: employer.companyName,
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
        if (!accountInfo.companyName || accountInfo.companyName.length < 3 ||
            !nameRegex.test(accountInfo.companyName)) {
            newErrors.companyName = true;
            valid = false;
        } else {
            newErrors.companyName = false;
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
                email: employer.userDetails.email,
                newCompanyName: accountInfo.companyName,
                newPassword: accountInfo.password,
            }
            EmployerService.updateAccount(request)
                .then((response) => {
                    let updateResponse = response.data;
                    AppToaster.show({
                        message: t('update_account_success'),
                        intent: Intent.SUCCESS,
                    });
                    dispatch(setAuthData(true, null, updateResponse.employer, updateResponse.token));
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
                    {t('employer_info_acc')}
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
                                value={employer.userDetails.email}
                                placeholder="mail@gmail.com"
                                autoComplete="new-mail"
                                asyncControl={true}
                                readOnly={true}
                            />
                        </FormGroup>
                        <FormGroup
                            label={t('company')}
                            intent={errorsAccount.companyName ? Intent.DANGER : Intent.NONE}
                            helperText={errorsAccount.companyName ? t('company_err') : ""}
                            className="profile-field"
                            labelInfo={isAccountEdited ? "*" : ""}
                        >
                            <InputGroup
                                type="text"
                                autoComplete="new-name"
                                value={accountInfo.companyName}
                                placeholder="Joblistic"
                                asyncControl={true}
                                name="companyName"
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
                            label={t('password')}
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
                                rightElement={isAccountEdited &&
                                        <Button
                                            className="password-button"
                                            icon={showPassword ? 'eye-off' : 'eye-open'}
                                            minimal={true}
                                            onClick={togglePasswordVisibility}
                                            small={true}
                                            fill
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
                                companyName: employer.companyName,
                                password: "",
                                confirmPassword: "",
                            })
                            setErrorsAccount({
                                companyName: false,
                                password: false,
                                confirmPassword: false,
                            })
                            setIsAccountEdited(false)
                        }}>
                            {t('discard_changes')}
                        </Button>
                        <Button className="edit-profile-submit"
                                onClick={()=> submitNewAccount()}>
                            {t('submit')}
                        </Button>
                    </div>
                    }
                </form>
            </div>
        </Card>
    }

    const returnChartAccountCard = () => {
        return <Card className="edit-profile-card-container">
            <div className="edit-profile-card-title-container">
                <div className="edit-profile-card-title">
                    {t('chart_info_acc')}
                </div>
            </div>
            <div className="edit-profile-charts">
                <EmployerApplicationsPerDayChart employerId = {employer.employerId}/>
                <EmployerApplicationsStatusChart employerId = {employer.employerId}/>
                <EmployerApplicationsPerJobChart employerId = {employer.employerId}/>
            </div>
        </Card>
    }

    return (
        <div>
            <HeaderPageEmployer/>
            <div className="edit-account-container">
                <div className="edit-account-background">
                    <div className="edit-account-introduction">
                        <div className="edit-account-hello">
                            {t('hello')} {employer?.companyName}
                        </div>
                        <div className="edit-account-desc">
                            {t('account_desc_employer')}
                        </div>
                        <Button className="edit-profile-button"
                                onClick={() => {
                                    setIsAccountEdited(true);
                                    setShowPassword(false)
                                    setShowConfPassword(false)
                                    setAccountInfo({
                                        companyName: employer.companyName,
                                        password: "",
                                        confirmPassword: "",
                                    })
                                    setErrorsAccount({
                                        companyName: false,
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
                    <div className="edit-profile-card">
                        {returnChartAccountCard()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAccountPageEmployer;
