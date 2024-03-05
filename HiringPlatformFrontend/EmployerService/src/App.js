import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {setAuthData} from './redux/actions/authActions';
import AuthenticationService from './services/authentication.service';
import HomePage from "./components/HomePage";
import EditProfilePage from "./components/profile/EditProfilePage";
import {I18nextProvider} from 'react-i18next';
import i18n from "./util/i18n";
import NotFoundPage from "./components/common/notFound/NotFoundPage";
import EditAccountPage from "./components/EditAccountPage";
import ProfilePage from "./components/profile/ProfilePage";

const App = () => {
    const dispatch = useDispatch();
    const [isAuth, setIsAuth] = useState(false);
    const [authLoaded, setAuthLoaded] = useState(false);

    useEffect(() => {
        AuthenticationService.getLoggedUser().then((response) => {
            let registerResponse = response.data;
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
                    <Route path="/profile" element={isAuth ? <ProfilePage/> : redirectToWelcomePage()}/>
                    <Route path="/:paramLanguage" element={isAuth ? <EditProfilePage/> : redirectToWelcomePage()}/>
                    <Route path="/editAccount" element={isAuth ? <EditAccountPage/> : redirectToWelcomePage()}/>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </Router>
        </I18nextProvider>
    );
};

export default App;
