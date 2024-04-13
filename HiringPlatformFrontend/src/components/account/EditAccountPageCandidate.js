import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {Button, Card, FormGroup, InputGroup, Intent} from "@blueprintjs/core";
import './EditAccount.css';
import CandidateService from "../../services/candidate.service";
import {AppToaster} from "../common/AppToaster";
import {setAuthData} from "../../redux/actions/authActions";
import HeaderPageCandidate from "../header/HeaderPageCandidate";
import CandidateJobsTimelineChart from "./chart/CandidateJobsTimelineChart";
import CandidateApplicationsTimelineChart from "./chart/CandidateApplicationsTimelineChart";
import CandidateViewApplicationsChart from "./chart/CandidateViewApplicationsChart";

const EditAccountPageCandidate = () => {

    const {t} = useTranslation();
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
        setAccountInfo({
            lastname: candidate.lastname,
            firstname: candidate.firstname,
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

    const submitNewAccount = () => {
        if (validateAccount()) {
            let request = {
                email: candidate.userDetails.email,
                newFirstName: accountInfo.firstname,
                newLastName: accountInfo.lastname,
                newPassword: accountInfo.password,
            }
            CandidateService.updateAccount(request)
                .then((response) => {
                    let updateResponse = response.data;
                    AppToaster.show({
                        message: t('update_account_success'),
                        intent: Intent.SUCCESS,
                    });
                    dispatch(setAuthData(true, updateResponse.candidate, null, updateResponse.token));
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
                    {t('candidate_info_acc')}
                </div>
            </div>
            <div className="edit-profile-card-content">
                <form>
                    <FormGroup
                        label={t('email_address')}
                        className="profile-field"
                        labelInfo={isAccountEdited ? t('read_only') : ""}
                    >
                        <InputGroup
                            value={candidate.userDetails.email}
                            placeholder="mail@gmail.com"
                            autoComplete="new-mail"
                            asyncControl={true}
                            readOnly={true}
                        />
                    </FormGroup>
                    <div className="profile-fields-group">

                        <FormGroup
                            label={t('firstname')}
                            intent={errorsAccount.firstname ? Intent.DANGER : Intent.NONE}
                            helperText={errorsAccount.firstname ? t('firstname_err') : ""}
                            className="profile-field"
                            labelInfo={isAccountEdited ? "*" : ""}
                        >
                            <InputGroup
                                type="text"
                                name="firstname"
                                value={accountInfo.firstname}
                                placeholder="Maria"
                                autoComplete="new-user"
                                onChange={handleAccountChange}
                                readOnly={!isAccountEdited}
                            />
                        </FormGroup>
                        <FormGroup
                            label={t('lastname')}
                            intent={errorsAccount.lastname ? Intent.DANGER : Intent.NONE}
                            helperText={errorsAccount.lastname ? t('lastname_err') : ""}
                            className="profile-field"
                            labelInfo={isAccountEdited ? "*" : ""}
                        >
                            <InputGroup
                                type="text"
                                name="lastname"
                                value={accountInfo.lastname}
                                placeholder="Popescu"
                                asyncControl={true}
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
                                lastname: candidate.lastname,
                                firstname: candidate.firstname,
                                password: "",
                                confirmPassword: "",
                            })
                            setErrorsAccount({
                                lastname: false,
                                firstname: false,
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
                <CandidateApplicationsTimelineChart candidateId={candidate.candidateId}/>
                <CandidateJobsTimelineChart/>
                <CandidateViewApplicationsChart candidateId={candidate.candidateId}/>
            </div>
        </Card>
    }

    return (
        <div>
            <HeaderPageCandidate/>
            <div className="edit-account-container">
                <div className="edit-account-background">
                    <div className="edit-account-introduction">
                        <div className="edit-account-hello">
                            {t('hello')} {candidate?.firstname}
                        </div>
                        <div className="edit-account-desc">
                            {t('account_desc_candidate')}
                        </div>
                        <Button className="edit-profile-button"
                                onClick={() => {
                                    setIsAccountEdited(true);
                                    setShowPassword(false)
                                    setShowConfPassword(false)
                                    setAccountInfo({
                                        lastname: candidate.lastname,
                                        firstname: candidate.firstname,
                                        password: "",
                                        confirmPassword: "",
                                    })
                                    setErrorsAccount({
                                        lastname: false,
                                        firstname: false,
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

export default EditAccountPageCandidate;
