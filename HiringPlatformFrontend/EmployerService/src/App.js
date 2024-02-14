import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {setAuthData} from './redux/actions/authActions';
import AuthenticationService from './services/authentication.service';
import {EmployerResponse} from "./types/auth.types";
import HomePage from "./components/HomePage";
import ProfilePage from "./components/profile/ProfilePage";
import {I18nextProvider} from 'react-i18next';
import i18n from "./util/i18n";

const App = () => {
    const dispatch = useDispatch();
    const [isAuth, setIsAuth] = useState(false);
    const [authLoaded, setAuthLoaded] = useState(false);

    useEffect(() => {
        AuthenticationService.getLoggedUser().then((response: any) => {
            let registerResponse: EmployerResponse = response.data;
            if (registerResponse.token) {
                setIsAuth(true)
                dispatch(setAuthData(true, registerResponse.employer, registerResponse.token));
            }
        })
            .catch(error => {
                console.error('Error:', error.message);
                window.location.replace('http://localhost:3000/login');
            })
            .finally(() => {
                setAuthLoaded(true);
            });
    }, []);

    const redirectToWelcomePage = () => {
        window.location.replace('http://localhost:3000/login');
        return null;
    };

    if (!authLoaded) {
        return null;
    }

    return (
        <I18nextProvider i18n={i18n}>
            <Router>
                <Routes>
                    <Route path="/home" element={isAuth ? <HomePage/> : redirectToWelcomePage()}/>
                    <Route path="/:paramLanguage" element={isAuth ? <ProfilePage/> : redirectToWelcomePage()}/>
                </Routes>
            </Router>
        </I18nextProvider>
    );
};

export default App;
