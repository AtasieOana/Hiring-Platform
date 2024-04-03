import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import "../styles/Login.css"
import {Button, FormGroup, InputGroup, Intent, Spinner, Text} from "@blueprintjs/core";
import {useTranslation} from "react-i18next";
import AuthenticationService from "../../services/authentication.service";
import {LoginResponse, UserGoogleRequest} from "../../types/auth.types";
import {CANDIDATE_ACCOUNT, EMPLOYER_ACCOUNT} from "../../util/constants";
import {AppToaster} from "../common/AppToaster";
import {signInWithGooglePopup} from "../google/firebase.utils";
import EmployerService from "../../services/employer.service";
import {useDispatch} from "react-redux";
import {setAuthData} from "../../redux/actions/authActions";
import {setProfileActionData} from "../../redux/actions/profileActions";
import CandidateService from "../../services/candidate.service";
import HeaderAuth from "../header/HeaderAuth";

const LoginPage = () => {

    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginInvalid, setLoginInvalid] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const setEmployerInRedux = () => {
        EmployerService.getLoggedEmployer().then((response: any) => {
            let registerResponse = response.data;
            if (registerResponse.token) {
                dispatch(setAuthData(true, null, registerResponse.employer, registerResponse.token));
                dispatch(setProfileActionData(response.data.hasProfile));
                setIsLoading(false)
                if(response.data.hasProfile) {
                    navigate("/allJobs")
                }
                else{
                    navigate("/addProfile")
                }
            }
        }).catch(error => {
            navigate("/login")
        })
    }

    const setCandidateInRedux = () => {
        CandidateService.getLoggedCandidate().then((response: any) => {
            let registerResponse = response.data;
            if (registerResponse.token) {
                dispatch(setAuthData(true, registerResponse.candidate,null, registerResponse.token));
                dispatch(setProfileActionData(response.data.hasCv));
                setIsLoading(false)
                if(response.data.hasCv) {
                    navigate("/allCv")
                }
                else{
                    navigate("/addCv")
                }
            }
        }).catch(error => {
            navigate("/login")
        })
    }

    const handleLogin = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email) || !password) {
            setLoginInvalid(true)
        } else {
            setIsLoading(true)
            AuthenticationService.login(email, password).then((response: any) => {
                let loginResponse: LoginResponse = response.data;
                if (loginResponse.token === '') {
                    setLoginInvalid(true)
                    setIsLoading(false)
                } else {
                    setLoginInvalid(false)
                    if (loginResponse.roleName === CANDIDATE_ACCOUNT) {
                        setCandidateInRedux()
                    } else if (loginResponse.roleName === EMPLOYER_ACCOUNT) {
                        setEmployerInRedux()
                    }
                }
            }).catch((error) => {
                setIsLoading(false)
                console.error("Error during login: " + error.message);
                AppToaster.show({
                    message: t('login_error'),
                    intent: Intent.DANGER,
                });
            })
        }
    }

    const goToForgetPassword = () => {
        navigate('/forgotPassword');
    }

    let invalidLoginMessage = t('login_invalid')

    const logGoogleUser = async (accountType: string) => {
        try {
            const response = await signInWithGooglePopup();
            let request: UserGoogleRequest = {} as UserGoogleRequest;
            if (response.user.email != null && response.user.displayName != null) {
                let [givenName, familyName] = response.user.displayName.split(' ');
                if(givenName === null || familyName === null || givenName === undefined || familyName === undefined || givenName.length === 0 || familyName.length === 0)
                {
                    [request.givenName, request.familyName] = [response.user.displayName, response.user.displayName]
                }
                else{
                    [request.givenName, request.familyName] = [givenName, familyName]
                }
                request.email = response.user.email;
                request.name = response.user.displayName;
                request.accountType = accountType;
            }
            setIsLoading(true)
            AuthenticationService.loginGoogle((request)).then((response: any) => {
                if (response.data.token === "") {
                    setLoginInvalid(true)
                } else {
                    setLoginInvalid(false)
                    if (response.data.roleName === CANDIDATE_ACCOUNT) {
                        setCandidateInRedux()
                    } else if (response.data.roleName === EMPLOYER_ACCOUNT) {
                        setEmployerInRedux()
                    }
                }
            }).catch((error) => {
                setIsLoading(false)
                console.error("Error during authentication: " + error.message);
                AppToaster.show({
                    message: t('login_error'),
                    intent: Intent.DANGER,
                });
            })
        } catch (error: any) {
            console.error("Error during login: " + error.message);
            AppToaster.show({
                message: t('login_error'),
                intent: Intent.DANGER,
            });
        }
    }

    return (
        <div>
            <HeaderAuth/>
            <div className="login-container">
            <div className="login-title">{t('login_to')} Joblistic!</div>
            <div className="login-container-form">
                <form className="login-forms">
                    <FormGroup
                        label={t('email_address')}
                        className="login-form-group"
                        labelInfo={t('required')}
                    >
                        <InputGroup
                            value={email}
                            placeholder="mail@gmail.com"
                            autoComplete="new-email"
                            onChange={(e: any) => setEmail(e.target.value)}
                            asyncControl={true}
                        />
                    </FormGroup>
                    <FormGroup
                        label={t('password')}
                        intent={loginInvalid ? Intent.DANGER : Intent.NONE}
                        helperText={loginInvalid ? invalidLoginMessage : ""}
                        className="login-form-group"
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
                    <div className="forgot-password">
                        <Text onClick={goToForgetPassword}>
                            {t('password_title')}
                        </Text>
                    </div>
                </form>
                {isLoading ? <Spinner className="central-spinner"
                                      size={20}/> :
                                <div><Button onClick={handleLogin}
                                    small={true}
                                    className="login-button"
                            >
                                {t('login_button')}
                            </Button>
                            <div className="text-or">
                                OR
                            </div>
                            <Button className="register-button"
                                    small={true}
                                    onClick={() => logGoogleUser(EMPLOYER_ACCOUNT)}>
                                {t('sign_google')}
                            </Button>
                    </div>}
            </div>
            <div className="login-go-to-register">
                <Link to="/register">
                    {t('login_go_to_register')} &#8594;
                </Link>
            </div>
            </div>
        </div>
    );
};

export default LoginPage;
