import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import "../styles/Login.css"
import {Button, FormGroup, InputGroup, Intent, Spinner, Text} from "@blueprintjs/core";
import {useTranslation} from "react-i18next";
import AuthenticationService from "../../services/authentication.service";
import {LoginResponse, UserGoogleRequest} from "../../types/auth.types";
import {BUCHAREST_RO, CANDIDATE_ACCOUNT, EMPLOYER_ACCOUNT} from "../../util/constants";
import {AppToaster} from "../common/AppToaster";
import {signInWithGooglePopup} from "../google/firebase.utils";
import EmployerService from "../../services/employer.service";
import {useDispatch} from "react-redux";
import {setAuthData} from "../../redux/actions/authActions";
import {setProfileActionData} from "../../redux/actions/profileActions";
import CandidateService from "../../services/candidate.service";
import HeaderAuth from "../header/HeaderAuth";
import {setCvActionData} from "../../redux/actions/cvActions";
import GoogleLogo from "../../resources-photo/GoogleLogo.png";
import CommonService from "../../services/common.service";
import {setAddressData} from "../../redux/actions/addressActions";

const LoginPage = () => {

    const {t} = useTranslation();
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

    const getAllCitiesByRegions = () =>{
        CommonService.getAllCitiesByRegions().then((response) => {
            const updatedResponseObj = { ...response.data };
            const newObjKey = 'Bucharest';
            updatedResponseObj[newObjKey] = ['Bucharest'];
            dispatch(setAddressData(Object.keys(updatedResponseObj), updatedResponseObj));
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('city_region_err'),
                intent: Intent.DANGER,
            });
        });
    }

    const setEmployerInRedux = () => {
        EmployerService.getLoggedEmployer().then((response: any) => {
            let registerResponse = response.data;
            if (registerResponse.token) {
                getAllCitiesByRegions()
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
        }).catch(() => {
            navigate("/login")
        })
    }

    const setCandidateInRedux = () => {
        CandidateService.getLoggedCandidate().then((response: any) => {
            let registerResponse = response.data;
            if (registerResponse.token) {
                getAllCitiesByRegions()
                dispatch(setAuthData(true, registerResponse.candidate,null, registerResponse.token));
                dispatch(setCvActionData(response.data.hasCv));
                setIsLoading(false)
                if(response.data.hasCv === true) {
                    navigate("/allCv")
                }
                else{
                    navigate("/addCv")
                }
            }
        }).catch(() => {
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
            setIsLoading(false)
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
                <div className="login-container-form">
                    <div className="login-title">{t('login_to')}!</div>
                    <div className="login-go-to-register">
                        {t('login_go_to_register1')}
                        <Link to="/register">
                            {t('login_go_to_register2')}
                        </Link>
                    </div>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            handleLogin()
                        }}>
                        <div className="login-forms">
                            <FormGroup
                                label={t('email_address')}
                                className="login-form-group"
                                labelInfo={"*"}
                            >
                                <InputGroup
                                    value={email}
                                    placeholder={t('email_placeholder')}
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
                                labelInfo={"*"}
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
                        </div>
                        {isLoading ? <Spinner className="central-spinner"
                                              size={40}/> :
                            <div><Button onClick={handleLogin}
                                         small={true}
                                         className="login-button"
                                         type="submit"
                            >
                                {t('login_button')}
                            </Button>
                                <div className="text-or-separator">
                                    <span className="text-or">
                                        OR
                                    </span>
                                </div>
                                <Button className="google-button"
                                        small={true}
                                        onClick={() => logGoogleUser(EMPLOYER_ACCOUNT)}>
                                    <img className="google-button-img" src={GoogleLogo} alt="Google Logo"/>

                                    {t('sign_google')}
                                </Button>
                            </div>
                        }
                    </form>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;
