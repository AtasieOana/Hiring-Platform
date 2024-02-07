import React, {useEffect} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {I18nextProvider} from 'react-i18next';
import i18n from "./util/i18n";
import AuthenticationService from "./services/authentication.service";
import {EmployerResponse} from "./types/auth.types";
import {useDispatch} from "react-redux";
import {setAuthData} from "./redux/actions/authActions";
import RouterPage from "./components/RouterPage";
import HomePage from "./components/HomePage";
import ProfilePage from "./components/profile/ProfilePage";


const App = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        AuthenticationService.getLoggedUser().then((response: any) => {
            let registerResponse: EmployerResponse = response.data;
            if (registerResponse.token === "" || registerResponse.token === null) {
                window.location.href = 'http://localhost:3000/login'
            } else {
                dispatch(setAuthData(registerResponse.employer, registerResponse.token));
            }
        }).catch((error) => {
            console.error("Error : " + error.message);
            window.location.href = 'http://localhost:3000/login'
        })
    }, [dispatch]);

    return (
        <I18nextProvider i18n={i18n}>
            <Router>
                <div>
                    <Routes>
                        <Route path="/:paramLanguage" element={<RouterPage/>}/>
                        <Route path="/home" element={<HomePage/>}/>
                        <Route path="/profile" element={<ProfilePage/>}/>
                    </Routes>
                </div>
            </Router>
        </I18nextProvider>
    );
}

export default App;
