import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Button, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
import "./styles/Register.css"
import AuthenticationService from "../services/authentication.service";
import {
    RegisterCandidateRequest,
    RegisterEmployerRequest,
    RegisterResponse,
    UserGoogleRequest
} from "../types/auth.types";
import {CANDIDATE_ACCOUNT, EMPLOYER_ACCOUNT} from "../util/constants";
import {useTranslation} from "react-i18next";
import {AppToaster} from "./common/AppToaster";
import {signInWithGooglePopup} from "./google/firebase.utils";

interface FormErrors {
    emailRequired?: boolean;
    emailInvalid?: boolean;
    firstnameRequired?: boolean;
    firstnameLen?: boolean;
    firstnameInvalid?: boolean;
    lastnameRequired?: boolean;
    lastnameLen?: boolean;
    lastnameInvalid?: boolean;
    passwordRequired?: boolean;
    passwordLen?: boolean;
    confirmPassword?: boolean;
    companyRequired?: boolean;
    companyLen?: boolean;
    companyInvalid?: boolean;
}

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState(CANDIDATE_ACCOUNT);
    const [errors, setErrors] = useState<FormErrors>({});

    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);

    const {t, i18n} = useTranslation();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfPasswordVisibility = () => {
        setShowConfPassword(!showConfPassword);
    };

    const handleRegisterCandidate = () => {
        // Validation for fields
        const newErrors: FormErrors = {}; // Define type for newErrors
        if (!email) {
            newErrors.emailRequired = true;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newErrors.emailInvalid = true;
            }
        }
        if (!firstName) {
            newErrors.firstnameRequired = true;
        } else {
            const usernameRegex = /^[a-zA-ZăâîșțĂÂÎȘȚ\- ]*$/;
            if (firstName.length < 3) {
                newErrors.firstnameLen = true;
            } else if (!usernameRegex.test(firstName)) {
                newErrors.firstnameInvalid = true;
            }
        }
        if (!lastName) {
            newErrors.lastnameRequired = true;
        } else {
            const usernameRegex = /^[a-zA-ZăâîșțĂÂÎȘȚ\- ]*$/;
            if (lastName.length < 3) {
                newErrors.lastnameLen = true;
            } else if (!usernameRegex.test(lastName)) {
                newErrors.lastnameInvalid = true;
            }
        }
        if (!password) {
            newErrors.passwordRequired = true;
        } else if (password.length < 5) {
            newErrors.passwordLen = true;
        }
        if (!newErrors.passwordLen && password !== confirmPassword) {
            newErrors.confirmPassword = true;
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        // Call the API for register
        registerUserCandidate();
        // Reset the errors if successful
        setErrors({});
    }

    const registerUserCandidate = () => {
        let registerRequest: RegisterCandidateRequest = {
            accountType: "",
            email: "",
            firstname: "",
            lastname: "",
            password: ""
        };
        registerRequest.email = email;
        registerRequest.password = password;
        registerRequest.lastname = lastName;
        registerRequest.firstname = firstName;
        registerRequest.accountType = userType;
        AuthenticationService.registerCandidate((registerRequest)).then((response: any) => {
            let registerResponse: RegisterResponse = response.data;
            navigate(`/token/${registerResponse.email}`);
        }).catch((error) => {
            console.error("Error during authentication: " + error.message);
            AppToaster.show({
                message: t('auth_error'),
                intent: Intent.DANGER,
            });
        })
    }

    const handleRegisterEmployer = () => {
        // Validation for fields
        const newErrors: FormErrors = {}; // Define type for newErrors
        if (!email) {
            newErrors.emailRequired = true;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newErrors.emailInvalid = true;
            }
        }
        if (!companyName) {
            newErrors.companyRequired = true;
        } else {
            const usernameRegex = /^[a-zA-ZăâîșțĂÂÎȘȚ0-9\-& ]*$/;
            if (companyName.length < 3) {
                newErrors.companyLen = true;
            } else if (!usernameRegex.test(companyName)) {
                newErrors.companyInvalid = true;
            }
        }
        if (!password) {
            newErrors.passwordRequired = true;
        } else if (password.length < 5) {
            newErrors.passwordLen = true;
        }
        if (!newErrors.passwordLen && password !== confirmPassword) {
            newErrors.confirmPassword = true;
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        // Call the API for register
        registerUserEmployer();
        // Reset the errors if successful
        setErrors({});
    };

    const registerUserEmployer = () => {
        let registerRequest: RegisterEmployerRequest = {accountType: "", companyName: "", email: "", password: ""};
        registerRequest.email = email;
        registerRequest.password = password;
        registerRequest.companyName = companyName;
        registerRequest.accountType = userType;
        AuthenticationService.registerEmployer((registerRequest)).then((response: any) => {
            let registerResponse: RegisterResponse = response.data;
            navigate(`/token/${registerResponse.email}`);
        }).catch((error) => {
            console.error("Error during authentication: " + error.message);
            AppToaster.show({
                message: t('auth_error'),
                intent: Intent.DANGER,
            });
        })
    }

    const logGoogleUser = async (accountType: string) => {
        try {
            const response = await signInWithGooglePopup();
            let request: UserGoogleRequest = {accountType: "", email: "", familyName: "", givenName: "", name: ""};
            if (response.user.email != null && response.user.displayName != null) {
                request.email = response.user.email;
                request.name = response.user.displayName;
                request.accountType = accountType;
                [request.givenName, request.familyName] = response.user.displayName.split(' ');
            }
            AuthenticationService.authGoogle((request)).then((response: any) => {
                let url = "";
                if (response.data.roleName === CANDIDATE_ACCOUNT) {
                    url = 'http://localhost:3002'
                } else if (response.data.roleName === EMPLOYER_ACCOUNT) {
                    url = 'http://localhost:3001'
                } else {
                    console.log("TODO - ADMIN")
                }
                const paramLanguage = i18n.language;
                if (paramLanguage) {
                    url += `/${paramLanguage}`;
                }
                window.location.href = url;
            }).catch((error) => {
                console.error("Error during authentication: " + error.message);
                AppToaster.show({
                    message: t('auth_error'),
                    intent: Intent.DANGER,
                });
            })
        } catch (error: any) {
            console.error("Error during register: " + error.message);
            AppToaster.show({
                message: t('auth_error'),
                intent: Intent.DANGER,
            });
        }
    }

    let mailError = "";
    if (errors.emailRequired) {
        mailError = t('email_address_req');
    } else if (errors.emailInvalid) {
        mailError = t('email_address_in');
    }
    let lastnameError = "";
    if (errors.lastnameRequired) {
        lastnameError = t('lastname_req');
    } else if (errors.lastnameLen) {
        lastnameError = t('lastname_len');
    } else if (errors.lastnameInvalid) {
        lastnameError = t('lastname_content');
    }
    let firstnameError = "";
    if (errors.firstnameRequired) {
        firstnameError = t('firstname_req');
    } else if (errors.firstnameLen) {
        firstnameError = t('firstname_len');
    } else if (errors.lastnameInvalid) {
        firstnameError = t('firstname_content');
    }
    let companyError = "";
    if (errors.companyRequired) {
        companyError = t('company_req');
    } else if (errors.companyLen) {
        companyError = t('company_len');
    } else if (errors.companyInvalid) {
        companyError = t('company_content');
    }
    let passwordError = "";
    if (errors.passwordRequired) {
        passwordError = t('password_req');
    } else if (errors.passwordLen) {
        passwordError = t('password_len');
    }
    let confirmError = "";
    if (errors.confirmPassword) {
        confirmError = t('password_confirm');
    }


    const generatePasswordFields = () => {
        return (
            <div className="password-fields">
                <FormGroup
                    label={t('password')}
                    intent={passwordError ? Intent.DANGER : Intent.NONE}
                    helperText={passwordError ? passwordError : ""}
                    className="register-form-group"
                    labelInfo={t('required')}
                >
                    <InputGroup
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        autoComplete="new-password"
                        placeholder={t('password_placeholder')}
                        onChange={(e: any) => setPassword(e.target.value)}
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
                    intent={confirmError ? Intent.DANGER : Intent.NONE}
                    helperText={confirmError ? confirmError : ""}
                    className="register-form-group"
                    labelInfo={t('required')}
                >
                    <InputGroup
                        type={showConfPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        placeholder={t('password_confirm_placeholder')}
                        autoComplete="new-password"
                        onChange={(e: any) => setConfirmPassword(e.target.value)}
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
        )
    }

    const candidatePanel = () => {
        return (
            <div>
                <div className="register-container-form">
                    <form className="register-forms">
                        <FormGroup
                            label={t('email_address')}
                            intent={mailError ? Intent.DANGER : Intent.NONE}
                            helperText={mailError ? mailError : ""}
                            className="register-form-group"
                            labelInfo={t('required')}
                        >
                            <InputGroup
                                value={email}
                                placeholder="mail@gmail.com"
                                onChange={(e: any) => setEmail(e.target.value)}
                                asyncControl={true}
                            />
                        </FormGroup>
                        <FormGroup
                            label={t('lastname')}
                            intent={lastnameError ? Intent.DANGER : Intent.NONE}
                            helperText={lastnameError ? lastnameError : ""}
                            className="register-form-group"
                            labelInfo={t('required')}
                        >
                            <InputGroup
                                type="text"
                                value={lastName}
                                placeholder="Popescu"
                                asyncControl={true}
                                onChange={(e: any) => setLastName(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup
                            label={t('firstname')}
                            intent={firstnameError ? Intent.DANGER : Intent.NONE}
                            helperText={firstnameError ? firstnameError : ""}
                            className="register-form-group"
                            labelInfo={t('required')}
                        >
                            <InputGroup
                                type="text"
                                value={firstName}
                                placeholder="Maria"
                                autoComplete="new-user"
                                onChange={(e: any) => setFirstName(e.target.value)}
                            />
                        </FormGroup>
                        {generatePasswordFields()}
                    </form>
                    <Button onClick={handleRegisterCandidate}
                            small={true}
                            className="register-button"
                    >
                        {t('register_button')}
                    </Button>
                    <div className="text-or">
                        OR
                    </div>
                    <Button className="register-button"
                            small={true}
                            onClick={() => logGoogleUser(EMPLOYER_ACCOUNT)}>
                        {t('sign_google')}
                    </Button>
                </div>
                <div className="register-go-to-login">
                    <Link to="/login">
                        {t('register_go_to_login')} &#8594;
                    </Link>
                </div>
            </div>
        );
    };


    const employerPanel = () => {
        return (
            <div>
                <div className="register-container-form">
                    <form className="register-forms">
                        <FormGroup
                            label={t('email_address')}
                            intent={mailError ? Intent.DANGER : Intent.NONE}
                            helperText={mailError ? mailError : ""}
                            className="register-form-group"
                            labelInfo={t('required')}
                        >
                            <InputGroup
                                value={email}
                                placeholder="mail@gmail.com"
                                onChange={(e: any) => setEmail(e.target.value)}
                                asyncControl={true}
                            />
                        </FormGroup>
                        <FormGroup
                            label={t('company')}
                            intent={companyError ? Intent.DANGER : Intent.NONE}
                            helperText={companyError ? companyError : ""}
                            className="register-form-group"
                            labelInfo={t('required')}
                        >
                            <InputGroup
                                type="text"
                                value={companyName}
                                placeholder="Joblistic"
                                asyncControl={true}
                                onChange={(e: any) => setCompanyName(e.target.value)}
                            />
                        </FormGroup>
                        {generatePasswordFields()}
                    </form>
                    <Button onClick={handleRegisterEmployer}
                            small={true}
                            className="register-button"
                    >
                        {t('register_button')}
                    </Button>
                    <div className="text-or">
                        OR
                    </div>
                    <Button className="register-button"
                            small={true}
                            onClick={() => logGoogleUser(EMPLOYER_ACCOUNT)}>
                        {t('sign_google')}
                    </Button>
                </div>
                <div className="register-go-to-login">
                    <Link to="/login">
                        {t('register_go_to_login')} &#8594;
                    </Link>
                </div>
            </div>
        );
    };

    const resetState = () => {
        setEmail('');
        setCompanyName('');
        setFirstName('');
        setLastName('');
        setPassword('');
        setConfirmPassword('');
        setErrors({});
        setShowPassword(false);
        setShowConfPassword(false);
    }

    return (
        <div className="register-container">
            <div className="register-title">{t('register_to')} Joblistic!</div>
            <div className="tabs">
                <div
                    className={`tab ${userType === CANDIDATE_ACCOUNT && 'active'}`}
                    onClick={() => {
                        resetState();
                        setUserType(CANDIDATE_ACCOUNT)
                    }}
                >
                    {t('candidate_label')}
                </div>
                <div
                    className={`tab ${userType === EMPLOYER_ACCOUNT && 'active'}`}
                    onClick={() => {
                        resetState();
                        setUserType(EMPLOYER_ACCOUNT)
                    }}
                >
                    {t('employer_label')}
                </div>
            </div>
            <div>
                {userType === CANDIDATE_ACCOUNT ? candidatePanel() : employerPanel()}
            </div>
        </div>
    );

};

export default RegisterPage;
