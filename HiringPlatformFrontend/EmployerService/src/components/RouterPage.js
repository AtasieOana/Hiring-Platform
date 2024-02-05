import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useTranslation} from "react-i18next";
import ProfileService from "../services/profile.service";

const RouterPage = ({employer, token}) => {
    const {t, i18n} = useTranslation();

    useEffect(() => {
        const urlPath = window.location.pathname;
        const parts = urlPath.split('/').filter(part => part !== '');

        if (parts.length >= 1) {
            const paramLanguage = parts[0];
            i18n.changeLanguage(paramLanguage);
        }

        console.log(employer)
        ProfileService.hasEmployerProfile(token, employer.userDetails.email)
            .then((response) => {
                if (response.data === true) {
                    console.log('CATRE HOME');
                } else {
                    console.log('CATRE CREARE PROFIL');
                }
            })
            .catch((error) => {
                console.error('Error : ' + error.message);
            });
    }, []);

    return (
        <div>
            Test
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        employer: state.auth.employer,
        token: state.auth.token,
    };
};

export default connect(mapStateToProps)(RouterPage);
