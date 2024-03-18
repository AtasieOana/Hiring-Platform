import React, {useEffect, useState} from 'react';
import './Profile.css';
import {Button, Card, Intent, Spinner} from "@blueprintjs/core";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import Image from "../../resources-photo/No_profile_image.jpg"
import EditProfileCommon from "./EditProfileCommon";
import ReactQuill from "react-quill";
import ProfileService from "../../services/profile.service";
import JobService from "../../services/job.service";
import {AppToaster} from "../common/AppToaster";
import MapDisplay from "../common/Map";
import HeaderPageEmployer from "../header/HeaderPageEmployer";
import HeaderPageCandidate from "../header/HeaderPageCandidate";
import {base64ToImage} from "../common/CommonMethods";
import {GetProfileResponse} from "../../types/profile.types";

const ProfilePage = () => {

    const {t} = useTranslation();
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    // Redux state
    const employer = useSelector((state: any) => state.auth.employer);
    const openedJob = useSelector((state: any) => state.job.jobDetails);
    const candidate = useSelector((state: any) => state.auth.candidate);

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
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [jobNr, setJobNr] = useState(0);
    const [usedEmployer, setUsedEmployer] = useState({
        employerId: "",
        companyName: "",
        userDetails: {
            email: '',
            userId: '',
            password: '',
            registrationDate: null,
            accountEnabled: 1,
            userRole: {
                roleId: "",
                roleName: "",
                roleDescription: ""
            }
        }
    });

    useEffect(() => {
        if (isAuthenticated) {
            if(candidate && candidate.candidateId !== ""){
                getProfileAsCandidate()
            }
            else{
                getProfileAsEmployer()
            }
        } else {
            navigate("/login")
        }
    }, []);

    const getProfileAsCandidate = () => {
        setIsLoading(true)
        let profileResponse: GetProfileResponse = openedJob.employerProfile
        setProfileInfo(profileResponse)
        setAddress(`${profileResponse.street}, ${profileResponse.cityName}, ${profileResponse.countryName}`)
        JobService.getNrJobsForEmployer(openedJob.employer.employerId).then((response: any) => {
            setJobNr(response.data)
            setIsLoading(false)
            setUsedEmployer(openedJob.employer)
        }).catch((error:any) => {
            console.log('Error: ', error.message);
            AppToaster.show({
                message: t('profile_err'),
                intent: Intent.DANGER,
            });
        });
    }

    const getProfileAsEmployer = () => {
        ProfileService.getProfile(employer.userDetails.email)
            .then((response: any) => {
                let profileResponse: GetProfileResponse = response.data;
                setProfileInfo(profileResponse)
                setAddress(`${profileResponse.street}, ${profileResponse.cityName}, ${profileResponse.countryName}`)
                setIsLoading(false);
                JobService.getNrJobsForEmployer(employer.employerId)
                    .then((response: any) => {
                        setJobNr(response.data)
                        setUsedEmployer(employer)
                    })
            })
            .catch((error:any) => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('profile_err'),
                    intent: Intent.DANGER,
                });
            });
    }

    const handleUpdate = () => {
        setIsEditing(false);
        getProfileAsEmployer();
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
                        <h2 className="profile-name">{usedEmployer.companyName}</h2>
                        <p className="profile-jobs">{t('jobs_available')}: {jobNr}</p>
                        {employer.employerId !== " " &&
                            <Button className="profile-button" onClick={() => {setIsEditing(true)}}>
                                {t('edit_information')}
                            </Button>
                        }
                    </div>
                </Card>
                <Card className="profile-card">
                    <div className="profile-info">
                        <div className="profile-heading">{t('contact')}</div>
                        <div className="profile-details">
                            <p>{t('email_simple')}: {usedEmployer.userDetails.email}</p>
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
                                  imgProp={base64ToImage(`data:image/jpeg;base64,${profileInfo.imagine}`)}
                                  updateEditionState={handleUpdate}/>
    }

    return (
        <div>
            {candidate && candidate.candidateId !== "" ? <HeaderPageCandidate/> : <HeaderPageEmployer/>}
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
