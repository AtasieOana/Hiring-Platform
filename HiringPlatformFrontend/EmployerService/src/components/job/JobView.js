import React, {useEffect, useReducer, useState} from 'react';
import {
    Button,
    Card, Dialog,
    DialogBody, DialogFooter,
    Icon, Intent,
} from "@blueprintjs/core";
import "./JobView.css";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import HeaderPage from "../header/HeaderPage";
import ProfileService from "../../services/profile.service";
import {AppToaster} from "../common/AppToaster";
import {useTranslation} from "react-i18next";
import Image from "../../resources-photo/No_profile_image.jpg";
import {
    contractEn,
    contractRo,
    experiencesEng,
    experiencesRo,
    industriesEng,
    industriesRo, possibleContractType, possibleExperiences, possibleRegimeEmp, possibleWorkMode, regimeEn,
    regimeRo, workEn, workRo
} from "../HomePage";
import {formatDate} from "../common/CommonMethods";
import JobService from "../../services/job.service";
import ReactQuillStatic from "../common/reactQuill/ReactQuillStatic";
import ReactQuillDynamic from "../common/reactQuill/ReactQuillDinamic";
import {setJobData} from "../../redux/actions/jobActions";

const JobView = () => {

    const {t, i18n} = useTranslation();
    const openedJob = useSelector(state => state.job.jobDetails);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const employer = useSelector((state) => state.auth.employer);
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
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDesc, setIsEditDesc] = useState(false);
    const [editedDesc, setEditedDesc] = useState("");

    const allIndustries = i18n.language === "ro" ? industriesRo : industriesEng
    const allExperiences = i18n.language === "ro" ? experiencesRo : experiencesEng
    const allContracts = i18n.language === "ro" ? contractRo : contractEn
    const allRegimes = i18n.language === "ro" ? regimeRo : regimeEn
    const allWorks = i18n.language === "ro" ? workRo : workEn

    /**
     * Method that verify if a job is opened
     */
    useEffect(() => {
        if(openedJob.title === ""){
            navigate("/home")
        }
        else{
            getProfile();
        }
    }, []);

    const getProfile = () => {
        ProfileService.getProfile(employer.userDetails.email)
            .then((response) => {
                let profileResponse = response.data;
                setProfileInfo(profileResponse)
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

    const updateJobDescription = () => {
        JobService.updateJobDescription({
            jobId: openedJob.jobId,
            description: editedDesc
        })
            .then((response) => {
                dispatch(setJobData(response.data));
            })
            .catch(error => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('update_desc_err'),
                    intent: Intent.DANGER,
                });
            });
    }

    /**
     * Handle the removal of a job
     */
    const deleteJob = () => {
        JobService.deleteJob(openedJob.jobId)
            .then(() => {
                AppToaster.show({
                    message: t('delete_job_success'),
                    intent: Intent.SUCCESS,
                });
                handleGoToHome()
            })
            .catch(error => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('delete_job_err'),
                    intent: Intent.DANGER,
                });
            });
    }

    /**
     * Handle navigation to home
     */
    const handleGoToHome = () => {
        navigate("/home")
    };

    /**
     * Handle navigation to profile
     */
    const handleViewProfile = () => {
        navigate("/profile")
    };

    /**
     * Handle applicants view
     */
    const handleViewApplicants = () => {
        console.log("TODO")
    };

    /**
     * Handle job removal
     */
    const handleDeleteJob = () => {
        setIsDeleteDialogOpen(true);
    };

    /**
     * Handle the press of the description edit button
     */
    const handleEditDescription = () => {
        setIsEditDesc(true)
        setEditedDesc(openedJob.description)
    };

    /**
     * Handle description save
     */
    const handleSaveDescription = () => {
        updateJobDescription()
        setIsEditDesc(false)
    }

    /**
     * Handle description input change
     */
    const handleDescChange = (content, _delta, _source, _editor) => {
        setEditedDesc(content);
    };

    /**
     * Render modal for job removal
     */
    const renderDeleteJobDialog = () => {
        return <Dialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                title={t('confirm_job_delete')}
                >
                    <DialogBody useOverflowScrollContainer={false}>
                        <p>{t('message_job_delete')}</p>
                        <DialogFooter minimal={true} actions={<div>
                            <Button intent="danger" onClick={deleteJob}>{t('delete')}</Button>
                            <Button onClick={() => setIsDeleteDialogOpen(false)}>{t('cancel')}</Button>
                        </div>}/>
                    </DialogBody>
                </Dialog>
    }

    return (
        <div>
            <HeaderPage/>
            <div className="show-job-details-page">
                <Button onClick={handleGoToHome}
                        minimal
                        icon={<Icon icon="arrow-left" size={13} color="black"/>}
                        text={t('go_back_to_all_jobs')}
                        className="back-to-all-jobs-button"
                />

                <div className="show-job-header">
                    <div className="show-job-cards">
                        <Card className="show-job-profile-card">
                            <div className="show-job-profile-info">
                                {profileInfo.imagine ?
                                    <img className="show-job-profile-image" src={`data:image/jpeg;base64,${profileInfo.imagine}`}
                                         alt="Company Logo"/>
                                    :
                                    <img className="show-job-profile-image" src={Image} alt="Company Logo"/>}
                                <h2 className="show-job-profile-name">{employer.companyName}</h2>
                                <p>{t('email_simple')}: <span className="show-job-profile-span">{employer.userDetails.email}</span></p>
                                <Button
                                    className="show-job-profile-button"
                                    onClick={() => {handleViewProfile()}}
                                >
                                    {t('see_profile')}
                                </Button>
                            </div>
                        </Card>

                        <Card className="show-job-card-details">
                            <div className="show-job-info">
                                <p>{t('experience')}:
                                    <span
                                        className="show-job-profile-span"> {allExperiences[possibleExperiences.findIndex(i => i === openedJob.experience)]}</span>
                                </p>
                                <p>{t('contract_type')}:
                                    <span
                                        className="show-job-profile-span"> {allContracts[possibleContractType.findIndex(i => i === openedJob.contractType)]}</span>
                                </p>
                                <p>{t('employment_regime')}:
                                    <span className="show-job-profile-span"> {allRegimes[possibleRegimeEmp.findIndex(i => i === openedJob.employmentRegime)]}</span>
                                </p>
                                <p>{t('industry')}:
                                    <span className="show-job-profile-span"> {allIndustries[industriesRo.findIndex(i => i === openedJob.industry)]}</span>
                                </p>
                                <p>{t('work_mode')}:
                                    <span className="show-job-profile-span"> {allWorks[possibleWorkMode.findIndex(i => i === openedJob.workMode)]}</span>
                                </p>
                                <p>{t('posting_date')}:
                                    <span className="show-job-profile-span"> {formatDate(openedJob.postingDate)}</span>
                                </p>
                                <p>{t('city')}:
                                    <span
                                        className="show-job-profile-span"> {openedJob.cityName}, {openedJob.regionName}, {openedJob.countryName}</span>
                                </p>
                            </div>
                        </Card>
                    </div>
                    <div className="show-job-details">
                        <div className="show-job-actions">
                            <Button onClick={handleViewApplicants} icon="people"
                                    intent={Intent.PRIMARY} text={t('view_applicants')}
                            />
                            <Button onClick={handleDeleteJob} icon="eraser"
                                    intent={Intent.DANGER} text={t('remove_job')}/>
                        </div>
                        <div className="show-job-title">{openedJob.title}</div>
                        <div className="show-job-edit-desc-container">
                            {!isEditDesc ?
                                <Button className="show-job-edit-desc" text={t('edit_job_desc')}
                                    icon="style" onClick={handleEditDescription} small/>
                                :
                                <Button className="show-job-edit-desc" text={t('save_job_desc')}
                                        icon="saved" onClick={handleSaveDescription} small/>
                            }
                        </div>
                        <Card className="show-job-card-description">
                            <div className="show-job-card-description-static">
                                {!isEditDesc &&
                                    <ReactQuillStatic value={openedJob.description}/>
                                }
                            </div>
                            <div className="show-job-card-description-dinamic">
                                {isEditDesc &&
                                    <ReactQuillDynamic value={editedDesc} handleDescChange={handleDescChange}/>
                                }
                            </div>
                        </Card>
                    </div>
                </div>
                <Card className="show-stages-section">
                    <div className="show-job-title-section"> <Icon icon="path-search" color="black"/> {t('stages')} </div>
                    <ul className="show-job-list-section">
                        {openedJob.stages.map((stage, index) => (
                            <li key={index}>
                                <p>
                                    <span className="show-job-profile-span">{t('stage_nr') + " " + (index + 1) + ":"}</span> {stage.stageName}
                                </p>
                            </li>
                            ))}
                    </ul>
                </Card>
                {openedJob.questions.length > 0 &&
                    <Card className="show-questions-section">
                        <div className="show-job-title-section"> <Icon icon="help" color="black"/> {t('questions')} </div>
                        <ul className="show-job-list-section">
                            {openedJob.questions.map((question, index) => (
                                <li key={index}>
                                    <p>
                                        <span
                                            className="show-job-profile-span">{t('the_question') + " " + (index + 1) + ":"}</span> {question.questionText}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                }
            </div>
            {renderDeleteJobDialog()}
        </div>
    );
};

export default JobView;
