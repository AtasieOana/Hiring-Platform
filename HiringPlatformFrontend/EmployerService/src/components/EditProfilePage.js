import React, {useEffect, useState} from 'react';
import HeaderPage from "./header/HeaderPage";
import './EditProfile.css';
import ProfileService from "../services/profile.service";
import {AppToaster} from "./common/AppToaster";
import {Button, Card, Intent} from "@blueprintjs/core";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {GetProfileResponse} from "../types/profile.types";

const EditProfilePage = () => {

    const {t} = useTranslation();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const employer = useSelector(state => state.auth.employer);
    const navigate = useNavigate();

    const [profileInfo, setProfileInfo] = useState({
        imagine: "",
        description: "",
        phone: "",
        site: "",
        street: "",
        zipCode: "",
        cityName: "",
        regionName: "",
        countryName: "",
    })

    useEffect(() => {
        if (isAuthenticated) {
            ProfileService.getProfile(employer.userDetails.email)
                .then((response: any) => {
                    let profileResponse: GetProfileResponse = response.data;
                    setProfileInfo(profileResponse)
                    console.log(profileResponse)
                })
                .catch(error => {
                    console.error('Error: ', error.message);
                    AppToaster.show({
                        message: t('profile_err'),
                        intent: Intent.DANGER,
                    });
                    navigate("/home");
                });
        } else {
            window.location.replace('http://localhost:3000/login');
        }
    }, []);

    return (
        <div>
            <HeaderPage/>
            <div className="profile-container">
                <div className="profile-left-column">
                    <Card className="profile-card">
                        <div className="profile-info">
                            <img className="profile-image" src={`data:image/jpeg;base64,${profileInfo.imagine}`}
                                 alt="Company Logo"/>
                            <h2 className="profile-name">{employer.companyName}</h2>
                            <p className="profile-jobs">Anunțuri disponibile: TODO</p>
                            <Button className="profile-button">
                                {t('edit_information')}
                            </Button>
                        </div>
                    </Card>
                    <Card className="profile-card">
                        <div className="profile-info">
                            <div className="profile-heading">Contact</div>
                            <div className="profile-details">
                                <p>{profileInfo.street}, {profileInfo.zipCode}, {profileInfo.cityName}</p>
                                <p>Regiunea {profileInfo.regionName}, {profileInfo.countryName}</p>
                                <p>Email: {employer.userDetails.email}</p>
                                <p>Website: {profileInfo.site || "Informația nu a fost furnizată"}</p>
                                <p>Telefon: {profileInfo.phone || "Informația nu a fost furnizată"}</p>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="profile-right-column">
                    <Card className="profile-card-description">
                        <div dangerouslySetInnerHTML={{__html: profileInfo.description}}/>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default EditProfilePage;
