import React, { useState, useEffect } from 'react';
import { Card, Elevation, Intent } from '@blueprintjs/core';
import './Contact.css';
import AdminService from "../../services/admin.service";
import { AppToaster } from "../common/AppToaster";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import HeaderWithoutCV from "../header/HeaderPageWithoutCV";
import HeaderPageCandidate from "../header/HeaderPageCandidate";
import HeaderWithoutProfile from "../header/HeaderPageWithoutProfile";
import HeaderPageEmployer from "../header/HeaderPageEmployer";
import HeaderAdmin from "../header/HeaderAdmin";
import HeaderPage from "../header/HeaderAuth";
import ContactImg from "../../resources-photo/Contact_page.png"

const ContactPage = () => {
    const { t } = useTranslation();

    const hasCv = useSelector(state => state.cv.hasCv);
    const candidate = useSelector(state => state.auth.candidate);
    const employer = useSelector(state => state.auth.employer);
    const hasProfile = useSelector(state => state.profile.hasProfile);
    const isAuthenticatedAdmin = useSelector(state => state.admin.isAuthenticated);

    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        // Request admin list from backend
        AdminService.getAllAdmins().then(response => {
            setAdmins(response.data);
        }).catch(error => {
            console.log('Error: ', error.message);
            AppToaster.show({
                message: t('retrieve_admin_err'),
                intent: Intent.DANGER,
            });
        });
    }, []);

    const chooseHeader = () => {
        if (candidate && candidate.candidateId !== "") {
            console.log(hasCv)
            if (!hasCv) {
                return <HeaderWithoutCV />
            }
            else {
                return <HeaderPageCandidate />
            }
        }
        if (employer && employer.employerId !== "") {
            if (!hasProfile) {
                return <HeaderWithoutProfile />
            }
            else {
                return <HeaderPageEmployer />
            }
        }
        if (isAuthenticatedAdmin) {
            return <HeaderAdmin />
        }
        return <HeaderPage />
    }

    return (
        <div>
            {chooseHeader()}
            <div className="contact-page">
                <div className="contact-info">
                    <img src={ContactImg} alt="Contact" className="admin-image" />
                </div>
                <div className="admin-list-container">
                    <div className="title">{t('contact_us')}</div>
                    <div className="admin-text">
                        {t('contact_text')}
                    </div>
                    <ul>
                        {admins.map(admin => (
                            <li key={admin.email} className="admin-item">
                                {admin.username} - <span className="admin-imp"> {admin.email}</span>
                            </li >
                        ))}
                    </ul>
                </div>
            </div>
        </div>

    );
};

export default ContactPage;
