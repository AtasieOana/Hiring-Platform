import React, {useEffect, useState} from 'react';
import {Intent} from '@blueprintjs/core';
import 'react-quill/dist/quill.snow.css';
import './EditProfile.css';
import {useTranslation} from "react-i18next";
import HeaderWithoutProfile from "../header/HeaderPageWithoutProfile";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import ProfileService from "../../services/profile.service";
import {AppToaster} from "../common/AppToaster";
import EditProfileCommon from "./EditProfileCommon";

const EditProfilePage = () => {
    const {t, i18n} = useTranslation();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const employer = useSelector(state => state.auth.employer);
    const navigate = useNavigate();

    const formData = useState({
        image: null,
        phoneNumber: '',
        website: '',
        street: '',
        zipCode: '',
        city: '',
        region: '',
        country: '',
        description: ''
    });

    useEffect(() => {
        // Set the language
        const urlPath = window.location.pathname;
        const parts = urlPath.split('/').filter(part => part !== '');

        if (parts.length >= 1) {
            const paramLanguage = parts[0];
            i18n.changeLanguage(paramLanguage);
        }

        // Choose if the employer is redirect to profile creation or not
        if (isAuthenticated) {
            ProfileService.hasEmployerProfile(employer.userDetails.email)
                .then((response) => {
                    if (response.data === true) {
                        navigate('/home');
                    }
                })
                .catch(error => {
                    console.error('Error: ', error.message);
                    AppToaster.show({
                        message: t('profile_err'),
                        intent: Intent.DANGER,
                    });
                    window.location.replace('http://localhost:3000/login');
                });
        } else {
            window.location.replace('http://localhost:3000/login');
        }
    }, []);

    return (
        <div>
            <HeaderWithoutProfile/>
            <EditProfileCommon formDataProps={formData} isAddOperationProps={true} imgProp=""
                               updateEditionState={() => {
                               }}/>
        </div>
    );
};

export default EditProfilePage;
