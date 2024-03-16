import React, {useEffect, useState} from 'react';
import {
    Button, Card, Checkbox, DialogBody,
    DialogFooter, FormGroup, Dialog,
    Icon, Intent, Divider, Spinner, TextArea,
} from "@blueprintjs/core";
import "./JobView.css";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import HeaderPage from "../header/HeaderPage";
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
import {formatDate, handleOpenCV} from "../common/CommonMethods";
import ReactQuill from "react-quill";
import CandidateService from "../../services/candidate.service";
import {AppToaster} from "../common/AppToaster";
import AppService from "../../services/app.service";
import {initializeApp} from "firebase/app";

const JobView = () => {

    const {t, i18n} = useTranslation();
    const openedJob = useSelector(state => state.job.jobDetails);
    const navigate = useNavigate();
    const candidate = useSelector((state) => state.auth.candidate);
    const [applied, setApplied] = useState([]);

    const allIndustries = i18n.language === "ro" ? industriesRo : industriesEng
    const allExperiences = i18n.language === "ro" ? experiencesRo : experiencesEng
    const allContracts = i18n.language === "ro" ? contractRo : contractEn
    const allRegimes = i18n.language === "ro" ? regimeRo : regimeEn
    const allWorks = i18n.language === "ro" ? workRo : workEn

    const [isLoading, setIsLoading] = useState(true);

    const [chooseCVDialog, setChooseCVDialog] = useState(false);
    const [chosenCV, setChosenCv] = useState(null);
    const [cvList, setCvList] = useState([]);

    const [answersDialog, setAnswersDialog] = useState(false);
    const [questionWithAnswers, setQuestionWithAnswers] = useState([])

    /**
     * Method that verify if a job is opened
     */
    useEffect(() => {
        if(openedJob.title === ""){
            navigate("/home")
        }
        else{
            setIsLoading(true)
            getCvsForCandidate();
            getApplicationForCandidate()
            initializeAnswers()
        }
    }, []);

    const initializeAnswers = () =>{
        let answers = []
        if(openedJob.questions.length > 0){
            answers = openedJob.questions.map(q => {
                return {
                    questionText: q.questionText,
                    questionNumber: q.questionNumber,
                    answer: ""
                }
            })
        }
        setQuestionWithAnswers(answers)
    }

    const getCvsForCandidate = () =>{
        CandidateService.getCvListForCandidate(candidate.candidateId).then((response) => {
            let cvList = response.data;
            let dataCV = cvList.map(cv => {
                let shortName = cv.cvName.split("_").slice(1).join("_");
                return {
                    cvName: shortName,
                    uploadDate: cv.uploadDate,
                    cvId: cv.cvId,
                    cvNameComplete: cv.cvName
                }
            })
            setChosenCv(dataCV[0])
            setCvList(dataCV)
            getApplicationForCandidate()
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('cv_list_err'),
                intent: Intent.DANGER,
            });
        });
    }

    const getApplicationForCandidate = () =>{
        AppService.checkApplication(candidate.candidateId, openedJob.jobId).then((response) => {
            setApplied(response.data)
            setIsLoading(false)
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('app_err'),
                intent: Intent.DANGER,
            });
        });
    }

    /**
     * Handle navigation to home
     */
    const handleGoToHome = () => {
        navigate("/jobs")
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
    const handleViewApplications = () => {
        navigate("/applications")
    };

    /**
     * Handle job application
     */
    const handleJobApplication = () => {
        // first of all the candidate needs to choose a cv
        setChooseCVDialog(true)
    };

    const CVItem = ({ cv }) => {
        return (
            <div className="cv-item">
                <Checkbox
                    label={cv.cvName}
                    checked={chosenCV.cvNameComplete === cv.cvNameComplete}
                    onChange={() => setChosenCv(cv)}
                />
                <Button intent={Intent.PRIMARY} small onClick={() => handleOpenCV(cv)}>{t('view_cv')}</Button>

            </div>
        );
    };

    /**
     * Render modal for choosing a cv
     */
    const renderChooseCVDialog = () => {
        return <Dialog
            isOpen={chooseCVDialog}
            onClose={() => {
                    setChooseCVDialog(false)
                    setChosenCv(cvList[0])
                }
            }
            title={t('choose_a_cv')}
            className="cv-choose-dialog"
            canOutsideClickClose={false}
        >
            <DialogBody useOverflowScrollContainer={false}>
                <FormGroup
                    label={t('choose_a_cv_ex')}
                >
                    <div className="cv-choose-div">
                        {cvList.map(cv => (
                            <>
                                <CVItem
                                    key={cv.id}
                                    cv={cv}
                                />
                                <Divider/>
                            </>
                        ))}
                    </div>
                </FormGroup>
                <DialogFooter minimal={true} actions={
                    <div>
                        <Button intent="success"
                                onClick={() => {
                                    if(questionWithAnswers.length > 0){
                                        setChooseCVDialog(false)
                                        setAnswersDialog(true)
                                    }
                                    else{
                                        submitApplication()
                                    }}}
                            >
                            {questionWithAnswers.length > 0 ? t('next') : t('submit')}
                        </Button>
                    </div>
                }/>
            </DialogBody>
        </Dialog>
    }

    const handleAnswerChange = (newValue, index) =>{
        let answers = [...questionWithAnswers]
        answers[index].answer = newValue
        setQuestionWithAnswers(answers)
    }

    /**
     * Render modal for choosing a cv
     */
    const renderQuestionDialog = () => {
        return <Dialog
            isOpen={answersDialog}
            onClose={() => {
                    setAnswersDialog(false)
                    initializeAnswers()
                }
            }
            title={t('answer_questions')}
            className="cv-choose-dialog"
            canOutsideClickClose={false}
        >
            <DialogBody useOverflowScrollContainer={false}>
                <FormGroup
                    label={t('answer_questions_ex')}
                >
                    <div className="cv-choose-div">
                        {questionWithAnswers.map((qa, index) => (
                            <>
                                <FormGroup
                                    intent={qa.answer.length < 10 || qa.answer.length >= 4000 ? "danger" : "none"}
                                    helperText={qa.answer.length < 10 || qa.answer.length >= 4000 ? t('answer_err') : ""}
                                    label={(qa.questionNumber + 1) + ". " + qa.questionText}
                                >
                                    <TextArea
                                        value={qa.answer}
                                        onChange={(e) => handleAnswerChange(e.target.value, index)}
                                        placeholder={t('answer_placeholder')}
                                        rows={3}
                                        style={{width: "100%", resize: "none"}}
                                    />
                                </FormGroup>
                                <Divider/>
                            </>
                        ))}
                    </div>
                </FormGroup>
                <DialogFooter minimal={true} actions={
                    <div>
                        <Button intent="success"
                            onClick={submitApplication}
                                disabled={questionWithAnswers.filter(qa => qa.answer.length < 10 || qa.answer.length >= 4000).length > 0}
                        >
                            {t('submit')}
                        </Button>
                    </div>
                }/>
            </DialogBody>
        </Dialog>
    }

    const addAnswersForQuestions = () => {
        //If the job has question submit them:
        let qRequest = {
            candidateId: candidate.candidateId,
            jobId: openedJob.jobId,
            answerQuestionHelperList: questionWithAnswers
        }
        AppService.addAnswersForQuestions(qRequest).then((response) => {
            addApplication()
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('submit_apply_err'),
                intent: Intent.DANGER,
            });
        });
    }

    const addApplication = () => {
        //If the job has question submit them:
        let qRequest = {
            candidateId: candidate.candidateId,
            jobId: openedJob.jobId,
            cvId: chosenCV.cvId
        }
        AppService.applyToJob(qRequest).then((response) => {
            setApplied(true)
            setAnswersDialog(false)
            setChooseCVDialog(false)
            AppToaster.show({
                message: t('submit_apply'),
                intent: Intent.SUCCESS,
            });
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('submit_apply_err'),
                intent: Intent.DANGER,
            });
        });
    }

    const submitApplication = () =>{
        if(questionWithAnswers.length > 0){
            addAnswersForQuestions()
        }
    else{
            addApplication()
        }
    }

    return (
        <div>
            <HeaderPage/>
            {isLoading ?
                <div className="central-spinner-div">
                    <Spinner className="central-spinner"
                             size={200}/>
                </div> :
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
                                    {openedJob.employerProfile.imagine ?
                                        <img className="show-job-profile-image" src={`data:image/jpeg;base64,${openedJob.employerProfile.imagine}`}
                                             alt="Company Logo"/>
                                        :
                                        <img className="show-job-profile-image" src={Image} alt="Company Logo"/>}
                                    <h2 className="show-job-profile-name">{openedJob.employer.companyName}</h2>
                                    <p>{t('email_simple')}: <span className="show-job-profile-span">{openedJob.employer.userDetails.email}</span></p>
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
                                <Button onClick={handleViewApplications} icon="people"
                                        intent={Intent.PRIMARY} text={t('see_application')}
                                />
                                <Button onClick={handleJobApplication} icon="briefcase"
                                        disabled={applied}
                                        intent={Intent.SUCCESS}
                                        text={applied ? t('apply_already') : t('apply')}/>
                            </div>
                            <div className="show-job-title">{openedJob.title}</div>

                            <Card className="show-job-card-description">
                                    <ReactQuill
                                        value={openedJob.description}
                                        readOnly={true}
                                        theme={"bubble"}
                                    />
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
                    {renderChooseCVDialog()}
                    {renderQuestionDialog()}
                </div>
            }

        </div>

    );
};

export default JobView;
