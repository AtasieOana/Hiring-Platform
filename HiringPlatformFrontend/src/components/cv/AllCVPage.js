import React, {useEffect, useState} from 'react';
import {
    AnchorButton,
    Button, Card, Checkbox, Classes,
    Dialog,
    DialogBody,
    DialogFooter, Divider, Drawer, DrawerSize,
    FileInput,
    FormGroup,
    Icon, InputGroup,
    Intent, NonIdealState, TextArea,
    Tooltip
} from "@blueprintjs/core";
import {useTranslation} from "react-i18next";
import "./AllCVPage.css"
import CandidateService from "../../services/candidate.service";
import {useSelector} from "react-redux";
import {AppToaster} from "../common/AppToaster";
import firebase from "../../util/firebase";
import {getStorage, ref, uploadBytes} from 'firebase/storage';
import {FIREBASE_PATH} from "../../util/constants";
import ImageUpload from "../common/ImageUpload";
import EducationIcon from "../../resources-photo/No_education_image.png";
import ExperienceIcon from "../../resources-photo/No_experience_image.png";
import {addressRegex, defaultEd,
    defaultEx, phoneRegex,
    usernameRegex, emailRegex} from "./CreateCV";
import {generatePDF, handleOpenCV, useMediaQuery} from "../common/CommonMethods";
import HeaderPageCandidate from "../header/HeaderPageCandidate";

const AllCvPage = () => {

    const {t} = useTranslation();
    const candidate = useSelector(state => state.auth.candidate);

    const [data, setData] = useState([]);
    const [sortTypeCvName, setSortTypeCvName] = useState('asc');
    const [sortTypeDate, setSortTypeDate] = useState('asc');
    const [sortedData, setSortedData] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [cvToDelete, setCvToDelete] = useState(null);
    const [educationDialogOpen, setEducationDialogOpen] = useState(false);
    const [currentEd, setCurrentEd] = useState(defaultEd);
    const [currentEdIndex, setCurrentEdIndex] = useState(0);
    const [currentEx, setCurrentEx] = useState(defaultEx);
    const [currentExIndex, setCurrentExIndex] = useState(0);
    const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
    const [currentPresentEx, setCurrentPresentEx] = useState(false);
    const [cvFile, setCvFile] = useState(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [cvData, setCVData] = useState({
        image: '',
        lastname: '',
        firstname: '',
        email: '',
        phone: '',
        address: '',
        professionalSummary: '',
        education: [],
        experience: [],
    });
    const isSmallScreen = useMediaQuery("(max-width: 700px)");

    useEffect(() => {
        getCvsForCandidate()
        let cvDataCompleted = {...cvData}
        cvDataCompleted.email = candidate.userDetails.email
        cvDataCompleted.firstname = candidate.firstname
        cvDataCompleted.lastname = candidate.lastname
        setCVData(cvDataCompleted)
    }, []);

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
            setData(dataCV)
            setSortedData(dataCV);
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('cv_list_err'),
                intent: Intent.DANGER,
            });
        });
    }

    /**
     * Function to sort by resume name
     */
    const sortByCvName = () => {
        setSortTypeCvName(sortTypeCvName === 'asc' ? 'desc' : 'asc');
        let dataCopy = [...data]
        dataCopy.sort(compareCvName)
        setSortedData(dataCopy);
    };

    /**
     * Function to sort by resume date
     */
    const sortByUploadDate = () => {
        setSortTypeDate(sortTypeDate === 'asc' ? 'desc' : 'asc');
        let dataCopy = [...data]
        dataCopy.sort(compareUploadDate)
        setSortedData(dataCopy);
    };


    const compareCvName = (a, b) => {
        if (sortTypeCvName === 'asc') {
            return a.cvName.localeCompare(b.cvName);
        } else {
            return b.cvName.localeCompare(a.cvName);
        }
    };

    const compareUploadDate = (a, b) => {
        if (sortTypeDate === 'asc') {
            return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
        } else {
            return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        }
    };

    const uploadFile = () =>{
        addCV(cvFile, false, cvFile.name.slice(0, -4))
    }

    const addCV = (file, isStandard = true, fileNameUploaded = "") =>{
        // Set file name
        let uuidWithoutDashes = candidate.candidateId.replace(/-/g, "");
        let fileName;
        if(isStandard){
            let nrStandard = data.filter(cv => cv.cvNameComplete.includes("_Standard_")).length
            fileName = `${uuidWithoutDashes}_${candidate.lastname}_${candidate.firstname}_Standard_${nrStandard+1}.pdf`;
        }
        else{
            let nrWithName = data.filter(cv => cv.cvName.slice(0,-4) === fileNameUploaded).length
            let fileNameAfter = nrWithName === 0 ? fileNameUploaded : (fileNameUploaded + "_" + (nrWithName + 1))
            fileName = `${uuidWithoutDashes}_${fileNameAfter}.pdf`;
        }

        let request = {
            fileName: fileName,
            candidateId: candidate.candidateId
        }
        CandidateService.addCv(request).then((response) => {
            AppToaster.show({
                message: t('add_cv_success'),
                intent: Intent.SUCCESS,
            });
            setIsDialogOpen(false)
            setIsDrawerOpen(false)
            // Upload file to Firebase Storage
            const storage = getStorage(firebase);
            const storageRef = ref(storage, FIREBASE_PATH + fileName);
            uploadBytes(storageRef, file).then(r => {
                let dataCV = response.data.map(cv => {
                    let shortName = cv.cvName.split("_").slice(1).join("_");
                    return {
                        cvName: shortName,
                        uploadDate: cv.uploadDate,
                        cvId: cv.cvId,
                        cvNameComplete: cv.cvName
                    }
                })
                setData(dataCV)
                let dataCopy = [...dataCV]
                dataCopy.sort(compareUploadDate)
                setSortedData(dataCopy);
            })
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('add_cv_err'),
                intent: Intent.DANGER,
            });
        });
    }

    const handleFileUpload = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile.type === 'application/pdf') {
            setCvFile(selectedFile);
        } else{
            return;
        }
    };

    const renderUploadCVDialog = () => {
        return <Dialog
            isOpen={isDialogOpen}
            onClose={() => {
                setIsDialogOpen(false)
                setCvFile(null)
            }
            }
            title={t('upload_a_cv')}
            className="cv-upload-dialog"
        >
            <DialogBody useOverflowScrollContainer={false}>
                <FormGroup
                    label={t('upload_a_cv')}
                    labelInfo={t('only_pdf')}
                >
                    <FileInput
                        text={cvFile ? cvFile.name : t('choose_file')}
                        buttonText={t('choose')}
                        fill
                        inputProps={{
                            accept: '.pdf'
                        }}
                        onInputChange={handleFileUpload}
                    />
                </FormGroup>
                <DialogFooter minimal={true} actions={
                    <div>
                        <Button intent="primary"
                                onClick={uploadFile}
                                disabled={!cvFile}>
                            {t('upload')}
                        </Button>
                    </div>
                }/>
            </DialogBody>
        </Dialog>
    }

    const renderDeleteCVDialog = () => {
        return <Dialog
            isOpen={isDeleteDialogOpen}
            onClose={() => {
                setIsDeleteDialogOpen(false)
                setCvToDelete(null)
                }
            }
            title={t('delete_a_cv')}
            canOutsideClickClose={false}
        >
            <DialogBody useOverflowScrollContainer={false}>
                <p>{t('message_cv_delete')}</p>
                <DialogFooter minimal={true} actions={<div>
                    <Button intent="danger" onClick={deleteCv}>{t('delete')}</Button>
                    <Button onClick={() => setIsDeleteDialogOpen(false)}>{t('cancel')}</Button>
                </div>}/>
            </DialogBody>
        </Dialog>
    }

    const deleteCv = () => {
        CandidateService.deleteCv(cvToDelete.cvId).then((response) => {
            AppToaster.show({
                message: t('delete_cv_success'),
                intent: Intent.SUCCESS,
            });
            let dataCV = response.data.map(cv => {
                let shortName = cv.cvName.split("_").slice(1).join("_");
                return {
                    cvName: shortName,
                    uploadDate: cv.uploadDate,
                    cvId: cv.cvId,
                    cvNameComplete: cv.cvName
                }
            })
            setData(dataCV)
            let dataCopy = [...dataCV]
            dataCopy.sort(compareUploadDate)
            setSortedData(dataCopy);
            setCvToDelete(null)
            setIsDeleteDialogOpen(false)
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('delete_cv_err'),
                intent: Intent.DANGER,
            });
        });
    }

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    /**
     * Handle form input change
     * @param e
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCVData({ ...cvData, [name]: value });
    };

    /**
     * Add an education entry
     */
    const addEducationField = () => {
        let newEd = {...currentEd}
        setCVData({...cvData,
            education: [...cvData.education, newEd]
        });
        setEducationDialogOpen(false)
        setCurrentEdIndex(0)
        setCurrentEd(defaultEd)
    };

    /**
     * Add an experience entry
     */
    const addExperienceField = () => {
        let newEd = {...currentEx}
        setCVData({...cvData,
            experience: [...cvData.experience, newEd]
        });
        setExperienceDialogOpen(false)
        setCurrentEdIndex(0)
        setCurrentEx(defaultEx)
    };
    /**
     * Remove an experience entry
     * @param index
     */
    const removeExperienceField = (index) => {
        let cvDataEx = [...cvData.experience]
        cvDataEx.splice(index, 1)
        setCVData({
            ...cvData,
            experience: cvDataEx
        });
    };

    /**
     * Remove an experience entry
     */
    const editExperienceField = () => {
        let cvDataEx = [...cvData.experience]
        let editedEx = cvDataEx[currentExIndex]
        editedEx = {...currentEx}
        cvDataEx[currentExIndex] = editedEx
        setCVData({
            ...cvData,
            experience: cvDataEx
        });
        setExperienceDialogOpen(false)
        setCurrentEdIndex(0)
        setCurrentEx(defaultEx)
    };

    /**
     * Handle experience field change
     * @param e
     */
    const handleExperienceChange = (e) => {
        const { name, value } = e.target;
        const updatedEx = {...currentEx};
        updatedEx[name] = value;
        setCurrentEx(updatedEx);
    };

    /**
     * Remove an education entry
     * @param index
     */
    const removeEducationField = (index) => {
        let cvDataEducation = [...cvData.education]
        cvDataEducation.splice(index, 1)
        setCVData({
            ...cvData,
            education: cvDataEducation
        });
    };

    /**
     * Remove an education entry
     */
    const editEducationField = () => {
        let cvDataEducation = [...cvData.education]
        let editedEd = cvDataEducation[currentEdIndex]
        editedEd = {...currentEd}
        cvDataEducation[currentEdIndex] = editedEd
        setCVData({
            ...cvData,
            education: cvDataEducation
        });
        setEducationDialogOpen(false)
        setCurrentEdIndex(0)
        setCurrentEd(defaultEd)
    };

    /**
     * Handle education field change
     * @param e
     */
    const handleEducationChange = (e) => {
        const { name, value } = e.target;
        const updatedEducation = {...currentEd};
        updatedEducation[name] = value;
        setCurrentEd(updatedEducation);
    };

    /**
     * Handle image upload
     * @param image
     */
    const handleImageUpload = (image) => {
        setCVData({...cvData, image: image});
    };

    /**
     * Render modal for adding education
     */
    const renderEducationDialog = () => {
        const currentYear = new Date().getFullYear();
        return <Dialog
            isOpen={educationDialogOpen}
            onClose={() => {
                setEducationDialogOpen(false)
                setCurrentEdIndex(0)
                setCurrentEd(defaultEd)
            }
            }
            title={t('ed')}
            className="cv-section-dialog"
        >
            <DialogBody useOverflowScrollContainer={false}>
                <FormGroup label={t('institutes')}
                           intent={currentEd.institute?.length === 0 ? Intent.DANGER : Intent.NONE}
                           helperText={currentEd.institute?.length === 0 ? t('field_in') : ""}
                           labelInfo={t('required')}
                >
                    <InputGroup name="institute" value={currentEd.institute}
                                onChange={(e) => handleEducationChange(e)}
                    />
                </FormGroup>
                <div className="cv-years">
                    <FormGroup label={t('degree')}
                               intent={currentEd.certificate?.length === 0 ? Intent.DANGER : Intent.NONE}
                               helperText={currentEd.certificate?.length === 0 ? t('field_in') : ""}
                               labelInfo={t('required')}
                    >
                        <InputGroup name="certificate" value={currentEd.certificate}
                                    onChange={(e) => handleEducationChange(e)}
                                    placeholder={"Bachelor's degree"}
                        />
                    </FormGroup>
                    <FormGroup label={t('specialization')}
                               intent={currentEd.specialization?.length === 0 ? Intent.DANGER : Intent.NONE}
                               helperText={currentEd.specialization?.length === 0 ? t('field_in') : ""}
                               labelInfo={t('required')}
                    >
                        <InputGroup name="specialization"
                                    placeholder={"Business"}
                                    value={currentEd.specialization}
                                    onChange={(e) => handleEducationChange(e)}
                        />
                    </FormGroup>
                </div>
                <div className="cv-years">
                    <FormGroup label={t('startYear')}
                               intent={currentEd.startYear < currentYear - 100 ||
                               currentEd.startYear > currentYear + 100 ||
                               currentEd.startYear > currentEd.graduationYear
                                   ? Intent.DANGER : Intent.NONE}
                               helperText={currentEd.startYear < currentYear - 100 ||
                               currentEd.startYear > currentYear + 100
                                   ? t('year_in') : currentEd.startYear > currentEd.graduationYear ? t('start_finish_year') : ""}
                               labelInfo={t('required')}
                    >
                        <InputGroup name="startYear"
                                    type="number"
                                    placeholder={"2024"}
                                    min={currentYear - 100}
                                    max={currentYear + 100}
                                    value={currentEd.startYear}
                                    onChange={(e) => handleEducationChange(e)}
                        />
                    </FormGroup>
                    <FormGroup label={t('graduationYear')}
                               intent={currentEd.graduationYear < currentYear - 100 ||
                               currentEd.graduationYear > currentYear + 100
                                   ? Intent.DANGER : Intent.NONE}
                               helperText={currentEd.graduationYear < currentYear - 100 ||
                               currentEd.graduationYear > currentYear + 100
                                   ? t('year_in') : ""}
                               labelInfo={t('required')}
                    >
                        <InputGroup name="graduationYear"
                                    type="number"
                                    value={currentEd.graduationYear}
                                    placeholder={"2024"}
                                    min={currentYear - 100}
                                    max={currentYear + 100}
                                    onChange={(e) => handleEducationChange(e)}
                        />
                    </FormGroup>
                </div>
                <FormGroup label={t('description')}>
                    <TextArea name="description"
                              value={currentEd.description}
                              onChange={(e) => handleEducationChange(e)}
                              rows={3}
                              style={{width: "100%", resize: "none"}}/>
                </FormGroup>
                <DialogFooter minimal={true} actions={
                    <div>
                        <Button intent="primary"
                                onClick={currentEdIndex === cvData.education.length ? addEducationField : editEducationField}
                                disabled={currentEd.certificate?.length === 0 || currentEd.institute?.length === 0 ||
                                    currentEd.graduationYear < currentYear - 100 ||
                                    currentEd.graduationYear > currentYear + 100 || currentEd.specialization?.length === 0 ||
                                    currentEd.startYear < currentYear - 100 ||
                                    currentEd.startYear > currentYear + 100 || currentEd.startYear > currentEd.graduationYear
                                }
                        >
                            {"Save"}
                        </Button>
                    </div>
                }/>
            </DialogBody>
        </Dialog>
    }

    /**
     * Render modal for adding experience
     */
    const renderExperienceDialog = () => {
        let helperText = ""
        const currentYear = new Date().getFullYear();
        if (currentEx.startYear < currentYear - 100 ||
            currentEx.startYear > currentYear + 100){
            helperText = t('year_in')
        } else{
            if(!currentPresentEx && currentEx.startYear > currentEx.finishYear){
                helperText = t('start_finish_year')
            }
        }
        return <Dialog
            isOpen={experienceDialogOpen}
            onClose={() => {
                setExperienceDialogOpen(false)
                setCurrentExIndex(0)
                setCurrentEx(defaultEd)
                setCurrentPresentEx(false)
            }
            }
            title={t('experience')}
            className="cv-section-dialog"
        >
            <DialogBody useOverflowScrollContainer={false}>
                <FormGroup label={t('title')}
                           intent={currentEx.title?.length === 0 ? Intent.DANGER : Intent.NONE}
                           helperText={currentEx.title?.length === 0 ? t('field_in') : ""}
                           labelInfo={t('required')}
                >
                    <InputGroup name="title" value={currentEx.title}
                                onChange={(e) => handleExperienceChange(e)}
                    />
                </FormGroup>
                <FormGroup label={t('company')}
                           intent={currentEx.company?.length === 0 ? Intent.DANGER : Intent.NONE}
                           helperText={currentEx.company?.length === 0 ? t('field_in') : ""}
                           labelInfo={t('required')}
                >
                    <InputGroup name="company" value={currentEx.company}
                                onChange={(e) => handleExperienceChange(e)}
                    />
                </FormGroup>
                <Checkbox checked={currentPresentEx} label={t('work_present')}
                          onChange={inline => setCurrentPresentEx(!currentPresentEx)} />
                <div className="cv-years">
                    <FormGroup label={t('startYear')}
                               intent={helperText !== ""
                                   ? Intent.DANGER : Intent.NONE}
                               helperText={helperText}
                               labelInfo={t('required')}
                    >
                        <InputGroup name="startYear"
                                    type="number"
                                    placeholder={"2024"}
                                    min={currentYear - 100}
                                    max={currentYear + 100}
                                    value={currentEx.startYear}
                                    onChange={(e) => handleExperienceChange(e)}
                        />
                    </FormGroup>
                    <FormGroup label={t('finishYear')}
                               intent={!currentPresentEx && (currentEx.finishYear < currentYear - 100 ||
                                   currentEx.finishYear > currentYear + 100)
                                   ? Intent.DANGER : Intent.NONE}
                               helperText={!currentPresentEx && (currentEx.finishYear < currentYear - 100 ||
                                   currentEx.finishYear > currentYear + 100)
                                   ? t('year_in') : ""}
                    >
                        <InputGroup name="finishYear"
                                    type="number"
                                    value={currentEx.finishYear}
                                    placeholder={currentPresentEx ? "" : "2024"}
                                    min={currentYear - 100}
                                    max={currentYear + 100}
                                    disabled={currentPresentEx}
                                    onChange={(e) => handleExperienceChange(e)}
                        />
                    </FormGroup>
                </div>
                <FormGroup label={t('description')}>
                    <TextArea name="description"
                              value={currentEx.description}
                              onChange={(e) => handleExperienceChange(e)}
                              rows={3}
                              style={{width: "100%", resize: "none"}}/>
                </FormGroup>
                <DialogFooter minimal={true} actions={
                    <div>
                        <Button intent="primary"
                                onClick={currentExIndex === cvData.experience.length ?
                                    addExperienceField : editExperienceField}
                                disabled={currentEx.title?.length === 0 || currentEx.company?.length === 0 ||
                                    currentEx.startYear < currentYear - 100 ||
                                    currentEx.startYear > currentYear + 100 ||
                                    (!currentPresentEx && (currentEx.finishYear < currentYear - 100 ||
                                        currentEx.finishYear > currentYear + 100))
                                    || (!currentPresentEx  && currentEx.startYear > currentEx.finishYear)}
                        >
                            {"Save"}
                        </Button>
                    </div>
                }/>
            </DialogBody>
        </Dialog>
    }

    const renderTemplateCvDrawer = () => {
        return <Drawer
            isOpen={isDrawerOpen}
            onClose={()=>{
                setCVData({
                    image: '',
                    lastname: candidate.lastname,
                    firstname: candidate.firstname,
                    email: candidate.userDetails.email,
                    phone: '',
                    address: '',
                    professionalSummary: '',
                    education: [],
                    experience: [],
                })
                toggleDrawer()
            }}
            title={""}
            size={isSmallScreen ? "90%" : "70%"}
            position="right"
            className="cv-form-drawer-container"
            canOutsideClickClose={false}
        >
            <div className="cv-form-drawer">
                <div className="cv-form-general-section">
                    <div className="section-title-drawer">{t('general_info')}</div>
                    <div className="img-drawer">
                        <ImageUpload onImageUpload={handleImageUpload}/>
                    </div>
                    <div className="cv-form-group">
                        <FormGroup label={t('email_address')}
                                   labelInfo={t('required')}
                                   intent={!emailRegex.test(cvData.email) ? Intent.DANGER : Intent.NONE}
                                   helperText={!emailRegex.test(cvData.email) ? t('email_address_in') : ""}
                        >
                            <InputGroup type="email"
                                        name="email"
                                        placeholder="mail@gmail.com"
                                        value={cvData.email}
                                        onChange={handleInputChange}
                            />
                        </FormGroup>
                        <FormGroup label={t('firstname')}
                                   labelInfo={t('required')}
                                   intent={!usernameRegex.test(cvData.firstname) ? Intent.DANGER : Intent.NONE}
                                   helperText={!usernameRegex.test(cvData.firstname) ? t('firstname_in') : ""}>
                            <InputGroup name="firstname"
                                        value={cvData.firstname}
                                        onChange={handleInputChange}
                                        placeholder="Maria"
                            />
                        </FormGroup>
                        <FormGroup label={t('lastname')}
                                   labelInfo={t('required')}
                                   intent={!usernameRegex.test(cvData.lastname) ? Intent.DANGER : Intent.NONE}
                                   helperText={!usernameRegex.test(cvData.lastname) ? t('lastname_in') : ""}>
                            <InputGroup name="lastname"
                                        value={cvData.lastname}
                                        placeholder="Popescu"
                                        onChange={handleInputChange}/>
                        </FormGroup>
                    </div>
                    <div className="cv-form-group">
                        <FormGroup label={t('phone')}
                                   labelInfo={t('required')}
                                   intent={!phoneRegex.test(cvData.phone) ? Intent.DANGER : Intent.NONE}
                                   helperText={!phoneRegex.test(cvData.phone) ? t('phone_in') : ""}>
                            <InputGroup
                                type="tel"
                                name="phone"
                                value={cvData.phone}
                                placeholder="0745111111"
                                onChange={handleInputChange}/>
                        </FormGroup>
                        <FormGroup label={t('address')}
                                   intent={!addressRegex.test(cvData.address) ? Intent.DANGER : Intent.NONE}
                                   helperText={!addressRegex.test(cvData.address) ? t('address_in') : ""}
                        >
                            <InputGroup name="address"
                                        value={cvData.address}
                                        placeholder="Bucharest, Romania"
                                        onChange={handleInputChange}
                            />
                        </FormGroup>
                    </div>
                    <FormGroup label={t('professionalSummary')}
                               intent={cvData.professionalSummary.length <= 100 ? Intent.DANGER : Intent.NONE}
                               helperText={cvData.professionalSummary.length <= 100 ? t('summary_in') : ""}
                    >
                        <TextArea name="professionalSummary"
                                  value={cvData.professionalSummary}
                                  onChange={handleInputChange}
                                  rows={3}
                                  style={{width: "100%", resize: "none"}}/>
                    </FormGroup>
                </div>
                <Divider/>
                <div className="education-section">
                    <div className="section-header">
                        <span className="section-title-drawer">{t('ed')}</span>
                        <Button onClick={() => {
                            setCurrentEdIndex(cvData.education.length)
                            setCurrentEd(defaultEd)
                            setEducationDialogOpen(true)
                        }}
                                small
                                intent={Intent.SUCCESS} icon="learning"
                                className="add-section-button"
                        >
                            {t('add_ed')}
                        </Button></div>
                    <div>
                        {cvData.education.map((ed, index) => (
                            <Card key={index} className="education-card">
                                <div className="education-card-header">
                                    <p>{ed.institute}</p>
                                    <div className="education-card-header-buttons">
                                        <Tooltip content={t('edit_study')} position="bottom">
                                            <Button
                                                onClick={() => {
                                                    setCurrentEdIndex(index)
                                                    setCurrentEd(ed)
                                                    setEducationDialogOpen(true)
                                                }}
                                                small={true}
                                                minimal={true}
                                                icon={"style"}
                                                intent={Intent.PRIMARY}
                                            >
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content={t('remove_study')} position="bottom">
                                            <Button
                                                onClick={() => removeEducationField(index)}
                                                small={true}
                                                minimal={true}
                                                icon={"eraser"}
                                                intent={Intent.DANGER}
                                            >
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </div>
                                <p><strong><i>{ed.certificate}, {ed.specialization}</i></strong></p>
                                <p><em>{ed.startYear} - {ed.graduationYear}</em></p>
                                <p>{ed.description}</p>

                            </Card>
                        ))}
                    </div>
                    {cvData.education.length === 0 &&
                        <NonIdealState
                            icon={<img src={EducationIcon} alt="No education"/>}
                            title={t('no_education_added')}
                            description={(t('min_ed'))}
                            className="ideal-state-ed"
                        />
                    }
                    {renderEducationDialog()}
                </div>
                <Divider/>
                <div className="education-section">
                    <div className="section-header">
                        <span className="section-title-drawer">{t('experience')}</span>
                        <Button onClick={() => {
                            setCurrentExIndex(cvData.experience.length)
                            setCurrentEx(defaultEx)
                            setExperienceDialogOpen(true)
                            setCurrentPresentEx(false)
                        }}
                                small
                                intent={Intent.SUCCESS} icon="third-party"
                                className="add-section-button"
                        >
                            {t('add_experience')}
                        </Button></div>
                    <div>
                        {cvData.experience.map((ex, index) => (
                            <Card key={index} className="education-card">
                                <div className="education-card-header">
                                    <p>{ex.title}</p>
                                    <div className="education-card-header-buttons">
                                        <Tooltip content={t('edit_experience')} position="bottom">
                                            <Button
                                                onClick={() => {
                                                    setCurrentExIndex(index)
                                                    setCurrentEx(ex)
                                                    setExperienceDialogOpen(true)
                                                    setCurrentPresentEx(ex.finishYear === "")
                                                }}
                                                small={true}
                                                minimal={true}
                                                icon={"style"}
                                                intent={Intent.PRIMARY}
                                            >
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content={t('remove_experience')} position="bottom">
                                            <Button
                                                onClick={() => removeExperienceField(index)}
                                                small={true}
                                                minimal={true}
                                                icon={"eraser"}
                                                intent={Intent.DANGER}
                                            >
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </div>
                                <p><strong><i>{ex.company}</i></strong></p>
                                <p><em>{ex.startYear} - {ex.finishYear ? ex.finishYear : t('present')}</em></p>
                                <p>{ex.description}</p>

                            </Card>
                        ))}
                    </div>
                    {cvData.experience.length === 0 &&
                        <NonIdealState
                            icon={<img src={ExperienceIcon} alt="No experience"/>}
                            title={t('no_experience_added')}
                        />
                    }
                    {renderExperienceDialog()}
                </div>
            </div>
            <div className={Classes.DRAWER_FOOTER + " cv-drawer"}>
                <Button onClick={()=>generatePDF(cvData, addCV)}
                        intent={Intent.PRIMARY}
                        disabled={!emailRegex.test(cvData.email) ||
                            !usernameRegex.test(cvData.firstname) ||
                            !usernameRegex.test(cvData.lastname) ||
                            !phoneRegex.test(cvData.phone) ||
                            cvData.professionalSummary.length <= 100 ||
                            !addressRegex.test(cvData.address) ||
                            cvData.education.length === 0}
                >
                    {t('create_cv')}
                </Button>
            </div>
        </Drawer>
    }

    return (
        <div>
            <HeaderPageCandidate/>
            <div>
                <div className="multiple-cv-motivation">
                    {t('multiple_cv_motivation')}
                </div>
                <div className="add-cv-options">
                    <div className="add-cv-options-text">{t('add_cv_option')}</div>
                    <div className="add-cv-options-button">
                        <Button minimal
                                small
                                className={"add-cv-option"}
                                icon={<Icon icon="arrow-right" size={13} color="black"/>}
                                onClick={() => {
                                    setIsDialogOpen(true)
                                }}>
                            {t('upload_a_file')}
                        </Button>
                        <Button minimal
                                small
                                className={"add-cv-option"}
                                icon={<Icon icon="arrow-right" size={13} color="black"/>}
                                onClick={() => {
                                    toggleDrawer()
                                }}>
                            {t('use_standard_template')}
                        </Button>
                    </div>
                    {renderUploadCVDialog()}
                    {renderTemplateCvDrawer()}
                    {renderDeleteCVDialog()}
                    <table
                        className="bp4-html-table bp4-html-table-bordered cv-table-list">
                        <thead>
                        <tr>
                            <th>
                                <Tooltip content={sortTypeCvName === 'asc' ? t('sort_cv_name_asc') : t('sort_cv_name_desc') }>
                                    <AnchorButton minimal={true}  className="cv-sort-button" rightIcon={sortTypeCvName === 'asc' ? <Icon size={16} icon="sort-asc" color="black"/> : <Icon size={16} icon="sort-desc" color="black"/>} onClick={sortByCvName}>
                                        {t('cv_name')}
                                    </AnchorButton>
                                </Tooltip>
                            </th>
                            <th>
                                <Tooltip content={sortTypeDate === 'asc' ? t('sort_cv_date_asc') : t('sort_cv_date_desc')}>
                                    <AnchorButton className="cv-sort-button" minimal={true} rightIcon={sortTypeDate === 'asc' ? <Icon size={16} icon="sort-asc" color="black"/> : <Icon size={16} icon="sort-desc" color="black"/>} onClick={sortByUploadDate}>
                                        {t('cv_upload_date')}
                                    </AnchorButton>
                                </Tooltip>
                            </th>
                            <th><Tooltip>
                                <AnchorButton className="cv-sort-button cv-default-button" minimal={true}>
                                    {t('actions')}
                                </AnchorButton>
                            </Tooltip></th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedData.map(item => (
                            <tr key={item.cvId}>
                                <td>{item.cvName}</td>
                                <td>{item.uploadDate}</td>
                                <td className="cv-actions">
                                    <Tooltip content={t('view_cv')}>
                                        <Icon icon="list-detail-view" intent={Intent.PRIMARY} style={{marginRight: '10px'}}
                                        onClick={()=>{handleOpenCV(item)}}/>
                                    </Tooltip>
                                    <Tooltip content={t('delete_cv')}>
                                        <Icon icon="eraser" intent={Intent.DANGER}
                                              onClick={()=>{
                                                  setCvToDelete(item);
                                                  setIsDeleteDialogOpen(true)
                                              }}/>
                                    </Tooltip>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default AllCvPage;
