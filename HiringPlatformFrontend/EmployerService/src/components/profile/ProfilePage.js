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
import EditProfileCommon from "./EditProfileCommon";
import ReactQuill from "react-quill";
import {base64ToImage} from "../common/CommonMethods";

const ProfilePage = () => {

    const {t} = useTranslation();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const employer = useSelector(state => state.auth.employer);
    const navigate = useNavigate();
    const [address, setAddress] = useState("");
    const [profileInfo, setProfileInfo] = useState({
        image: "",
        description: "",
        phone: "",
        site: "",
        street: "",
        zipCode: "",
        cityName: "",
        regionName: "",
        countryName: "",
    })
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            getProfile()
        } else {
            window.location.replace('http://localhost:3000/login');
        }
    }, []);

    const getProfile = () => {
        ProfileService.getProfile(employer.userDetails.email)
            .then((response: any) => {
                let profileResponse: GetProfileResponse = response.data;
                setProfileInfo(profileResponse)
                setAddress(`${profileResponse.street}, ${profileResponse.cityName}, ${profileResponse.countryName}`)
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('profile_err'),
                    intent: Intent.DANGER,
                });
                navigate("/home");
            });
    }

    const handleUpdate = () => {
        setIsEditing(false);
        getProfile();
    }

    const handleImageUpload = (image) => {
        setProfileInfo({...profileInfo, image: image});
    };

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
                        <h2 className="profile-name">{employer.companyName}</h2>
                        <p className="profile-jobs">{t('jobs_available')}: TODO</p>
                        <Button className="profile-button" onClick={() => {
                            setIsEditing(true)
                        }}>
                            {t('edit_information')}
                        </Button>
                    </div>
                </Card>
                <Card className="profile-card">
                    <div className="profile-info">
                        <div className="profile-heading">{t('contact')}</div>
                        <div className="profile-details">
                            <p>{t('email_simple')}: {employer.userDetails.email}</p>
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

    const renderEditablePage = () => {
        const formData = {
            image: profileInfo.imagine,
            phoneNumber: profileInfo.phone,
            website: profileInfo.site,
            street: profileInfo.street,
            zipCode: profileInfo.zipCode,
            city: profileInfo.cityName,
            region: profileInfo.regionName,
            country: profileInfo.countryName,
            description: profileInfo.description
        }
        return <EditProfileCommon formDataProps={formData} isAddOperationProps={false}
                                  handleImageUploadProps={handleImageUpload}
                                  imgProp={base64ToImage(`data:image/jpeg;base64,${profileInfo.imagine}`)}
                                  updateEditionState={handleUpdate}/>
    }

    return (
        <div>
            <HeaderPage/>
            {isLoading ?
                <div className="central-spinner-div">
                    <Spinner className="central-spinner"
                             size={200}/>
                </div> :
                !isEditing ? renderStaticPage() : renderEditablePage()}
        </div>
    );
}

export default ProfilePage;
