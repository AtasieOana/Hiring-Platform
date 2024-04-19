import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import "../styles/Login.css"
import {Button, FormGroup, InputGroup, Intent, Spinner} from "@blueprintjs/core";
import {useTranslation} from "react-i18next";
import {LoginResponse} from "../../types/auth.types";
import {AppToaster} from "../common/AppToaster";
import {useDispatch} from "react-redux";
import AdminService from "../../services/admin.service";
import {setAdminData} from "../../redux/actions/adminActions";
import HeaderAdminAuthPage from "../header/HeaderAdminAuth";
import CommonService from "../../services/common.service";
import {setAddressData} from "../../redux/actions/addressActions";

const LoginAdminPage = () => {

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

    const handleLogin = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email) || !password) {
            setLoginInvalid(true)
        } else {
            setIsLoading(true)
            AdminService.loginAdmin(email, password).then((response: any) => {
                let loginResponse: LoginResponse = response.data;
                if (loginResponse.token === '') {
                    setLoginInvalid(true)
                    setIsLoading(false)
                } else {
                    setLoginInvalid(false)
                    getAllCitiesByRegions()
                    // Set admin in redux
                    dispatch(setAdminData(true, response.data.admin, response.data.token));
                    setIsLoading(false)
                    navigate("/allUsers")
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
    
    let invalidLoginMessage = t('login_invalid')
    
    return (
        <div>
            <HeaderAdminAuthPage/>
            <div className="login-container">
                <div className="login-container-form login-admin">
                    <div className="login-title">{t('as_admin')}</div>
                    <div className="login-go-to-register">
                        {t('login_admin_go_to_simple_login1')}
                        <Link to="/login">
                            {t('login_admin_go_to_simple_login2')}
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
                        </div>
                        {isLoading ? <Spinner className="central-spinner"
                                              size={40}/> :
                            <Button onClick={handleLogin}
                                    small={true}
                                    className="login-button-admin"
                                    type={"submit"}
                            >
                                {t('login_button')}
                            </Button>}
                    </form>
                </div>
            </div>
        </div>
);
};

export default LoginAdminPage;
