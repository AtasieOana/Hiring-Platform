import React, {useEffect, useState} from 'react';
import HeaderPage from "../header/HeaderPage";
import './Profile.css';
import ProfileService from "../../services/profile.service";
import {AppToaster} from "../common/AppToaster";
import {Button, Card, Intent, Spinner} from "@blueprintjs/core";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {GetProfileResponse} from "../../types/profile.types";
import Image from "../../resources-photo/No_profile_image.jpg";
import MapDisplay from "../common/Map";
import ReactQuill from "react-quill";
import JobService from "../../services/job.service";

const ProfilePage = () => {

    const {t} = useTranslation();
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const openedJob = useSelector((state: any) => state.job.jobDetails);
    const navigate = useNavigate();
    const [address, setAddress] = useState("");
    const [profileInfo, setProfileInfo] = useState<GetProfileResponse>({
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
    const [isLoading, setIsLoading] = useState(true);
    const [jobNr, setJobNr] = useState(0);

    useEffect(() => {
        if (isAuthenticated) {
            getProfile()
        } else {
            window.location.replace('http://localhost:3000/login');
        }
    }, []);

    const getProfile = () => {
        setIsLoading(true)
        let profileResponse: GetProfileResponse = openedJob.employerProfile
        setProfileInfo(profileResponse)
        setAddress(`${profileResponse.street}, ${profileResponse.cityName}, ${profileResponse.countryName}`)
        JobService.getNrJobsForEmployer(openedJob.employer.employerId).then((response: any) => {
            setJobNr(response.data)
            setIsLoading(false)
        }).catch((error:any) => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('profile_err'),
                    intent: Intent.DANGER,
                });
                navigate("/home");
        });
    }

    const renderStaticPage = () => {
        return <div className="profile-container">
            <div className="profile-left-column">
                <Card className="profile-card">
                    <div className="profile-info">
                        {profileInfo.imagine ?
                            <img className="profile-image" src={`data:image/jpeg;base64,${profileInfo.imagine}`}
                                 alt="Company Logo"/>
                            :
                            <img className="profile-image" src={Image} alt="Company Logo"/>}
                        <h2 className="profile-name">{openedJob.employer.companyName}</h2>
                        <p className="profile-jobs">{t('jobs_available')}: {jobNr}</p>
                    </div>
                </Card>
                <Card className="profile-card">
                    <div className="profile-info">
                        <div className="profile-heading">{t('contact')}</div>
                        <div className="profile-details">
                            <p>{t('email_simple')}: {openedJob.employer.userDetails.email}</p>
                            <p>{t('website')}: {profileInfo.site || t('info_not_provided')}</p>
                            <p>{t('phone_number')}: {profileInfo.phone || t('info_not_provided')}</p>
                        </div>
                    </div>
                </Card>
                <Card className="profile-card">
                    <div className="profile-info">
                        <div className="profile-heading">{t('location')}</div>
                        <div className="profile-details">
                            <p>{profileInfo.street}, {profileInfo.zipCode}, {profileInfo.cityName}</p>
                            <p>{t('region')} {profileInfo.regionName}, {profileInfo.countryName}</p>
                            <MapDisplay
                                address={address}/>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="profile-right-column">
                <Card className="profile-card-description">
                    <ReactQuill
                        value={profileInfo.description}
                        readOnly={true}
                        theme={"bubble"}
                    />
                </Card>
            </div>
        </div>
    }

    return (
        <div>
            <HeaderPage/>
            {isLoading ?
                <div className="central-spinner-div">
                    <Spinner className="central-spinner"
                             size={200}/>
                </div> :
                renderStaticPage()
            }
        </div>
    );
}

export default ProfilePage;
