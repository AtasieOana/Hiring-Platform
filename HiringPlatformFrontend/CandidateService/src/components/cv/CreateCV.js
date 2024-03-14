import React, {useEffect, useState} from 'react';
import HeaderPageWithoutCV from "../header/HeaderPageWithoutCV";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import jsPDF from 'jspdf';
import {
    Button,
    DialogBody,
    DialogFooter,
    Divider,
    FormGroup,
    InputGroup,
    TextArea,
    Dialog,
    FileInput,
    Intent,
    NonIdealState,
    Card,
    Tooltip,
    Checkbox
} from "@blueprintjs/core";
import ImageUpload from "../common/ImageUpload";
import "./CreateCv.css"
import EducationIcon from '../../resources-photo/No_education_image.png';
import ExperienceIcon from '../../resources-photo/No_experience_image.png';
import {fileToBase64} from "../common/CommonMethods";
import CandidateService from "../../services/candidate.service";
import {AppToaster} from "../common/AppToaster";
import {setCvActionData} from "../../redux/actions/cvActions";
import firebase from "../../util/firebase";
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import {FIREBASE_PATH} from "../../util/constants";

const defaultEd = {
    certificate: '',
    institute: '',
    startYear: '',
    graduationYear: '',
    specialization: '',
    description: ''
}

const defaultEx = {
    title: '',
    company: '',
    startYear: '',
    finishYear: '',
    description: ''
}

const CreateCV = () => {

    const {t} = useTranslation();
    const candidate = useSelector(state => state.auth.candidate);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // State
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
    const [cvFile, setCvFile] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [educationDialogOpen, setEducationDialogOpen] = useState(false);
    const [currentEd, setCurrentEd] = useState(defaultEd);
    const [currentEdIndex, setCurrentEdIndex] = useState(0);
    const [currentEx, setCurrentEx] = useState(defaultEd);
    const [currentExIndex, setCurrentExIndex] = useState(0);
    const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
    const [currentPresentEx, setCurrentPresentEx] = useState(false);

    useEffect(() => {
        let cvDataCompleted = {...cvData}
        cvDataCompleted.email = candidate.userDetails.email
        cvDataCompleted.firstname = candidate.firstname
        cvDataCompleted.lastname = candidate.lastname
        setCVData(cvDataCompleted)
    }, []);

    /**
     * Handle image upload
     * @param image
     */
    const handleImageUpload = (image) => {
        setCVData({...cvData, image: image});
    };

    /**
     * Handle cv upload
     * @param event
     */
    const handleFileUpload = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile.type === 'application/pdf') {
            setCvFile(selectedFile);
        } else{
            return;
        }
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

    const addCV = (file) =>{
        // Set file name
        let uuidWithoutDashes = candidate.candidateId.replace(/-/g, "");
        let fileName = `${uuidWithoutDashes}_${Date.now()}_${candidate.lastname}_${candidate.firstname}.pdf`;

        let request = {
            fileName: fileName,
            candidateId: candidate.candidateId
        }
        CandidateService.addCv(request).then(() => {
            AppToaster.show({
                message: t('add_cv_success'),
                intent: Intent.SUCCESS,
            });
            setIsDialogOpen(false)
            dispatch(setCvActionData(true));
            // Upload file to Firebase Storage
            const storage = getStorage(firebase);
            const storageRef = ref(storage, FIREBASE_PATH + fileName);
            uploadBytes(storageRef, file).then(r =>  navigate("/home"))
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('add_cv_err'),
                intent: Intent.DANGER,
            });
        });
    }

    const finishPDFGeneration = (doc, styling) => {
        const maxWidth = 115;

        const checkAndAddNewPage = (requiredSpace) => {
            if(rightColumnY > 290){
                doc.addPage()
                // Left part of the CV is going to be brown
                doc.setFillColor(188, 143, 143);
                doc.rect(0, 0, 70, 300, 'F');
                rightColumnY = 20;
            }
        };

        // Left side - on brown
        // Contact details
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.text('Contact', 10, styling);
        // Add border after contact title
        doc.setDrawColor(255, 255, 255);
        doc.line(10, styling + 5, 100, styling + 5);

        // Contact details: email, phone, address
        doc.setFont("helvetica", "normal");
        styling += 12;
        if (cvData.email) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text('Email:', 10, styling);
            styling += 5;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(cvData.email, 10, styling);
            styling += 7;
        }
        if (cvData.phone) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text('Phone:', 10, styling);
            styling += 5;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(cvData.phone, 10, styling);
            styling += 7;
        }
        if (cvData.address) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text('Address:', 10, styling);
            styling += 5;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(cvData.address, 10, styling);
        }

        // Right side
        // Firstname and lastname
        let name = cvData.firstname + " " + cvData.lastname
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text(name, 85, 25);

        // Professional summary, education and experience on the right
        let rightColumnX = 85;
        let rightColumnY = 40;
        doc.setFontSize(12);
        doc.setFont("helvetica", "italic");
        doc.text('Summary', rightColumnX, rightColumnY);
        rightColumnY += 7;

        // Add border
        doc.setDrawColor(139, 69, 19); // Maro
        doc.rect(rightColumnX, rightColumnY - 3, 250, 0.5, 'F');
        rightColumnY += 5;

        // Summary
        if (cvData.professionalSummary) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            // Add spaces after each word to ensure proper word wrapping
            const formattedSummary = cvData.professionalSummary.replace(/(\S+)\s*/g, "$1 ");
            const textLines = doc.splitTextToSize(formattedSummary, maxWidth);
            for (const line of textLines) {
                doc.text(line, rightColumnX, rightColumnY);
                rightColumnY += 5;
            }
        }

        rightColumnY += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "italic");
        doc.text('Education', rightColumnX, rightColumnY);
        rightColumnY += 7;
        doc.setFontSize(10);

        let requiredSpace = 20;

        // Add border
        doc.setDrawColor(139, 69, 19); // Maro
        doc.rect(rightColumnX, rightColumnY - 3, 250, 0.5, 'F');
        rightColumnY += 5;

        // Education
        if (cvData.education.length > 0) {
            cvData.education.forEach(ed => {
                doc.setFontSize(11);
                doc.setFont("helvetica", "bold");
                doc.text(`${ed.certificate}, ${ed.specialization}`, rightColumnX, rightColumnY);
                rightColumnY += 6;
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                doc.text(ed.institute, rightColumnX, rightColumnY);
                rightColumnY += 6;
                doc.setFont("helvetica", "italic");
                doc.text(`${ed.startYear} - ${ed.graduationYear}`, rightColumnX, rightColumnY);
                rightColumnY += 6;
                doc.setFont("helvetica", "normal");
                const descriptionLines = doc.splitTextToSize(ed.description, maxWidth);
                descriptionLines.forEach(line => {
                    doc.text(line, rightColumnX, rightColumnY);
                    rightColumnY += 5;
                });
                requiredSpace += cvData.education.length * 35;
                checkAndAddNewPage(requiredSpace);
            });
        }

        // Experience
        if (cvData.experience.length > 0) {
            rightColumnY += 10;
            doc.setFontSize(12);
            doc.setFont("helvetica", "italic");
            doc.text('Experience', rightColumnX, rightColumnY);
            rightColumnY += 7;

            // Add border
            doc.setDrawColor(139, 69, 19); // Maro
            doc.rect(rightColumnX, rightColumnY - 3, 250, 0.5, 'F');
            rightColumnY += 5;

            cvData.experience.forEach(exp => {
                doc.setFontSize(11);
                doc.setFont("helvetica", "bold");
                doc.text(exp.title, rightColumnX, rightColumnY);
                rightColumnY += 6;
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                doc.text(exp.company, rightColumnX, rightColumnY);
                rightColumnY += 6;
                doc.setFont("helvetica", "italic");
                doc.text(`${exp.startYear} - ${exp.finishYear ? exp.finishYear : "Present"}`, rightColumnX, rightColumnY);
                rightColumnY += 6;
                doc.setFont("helvetica", "normal");
                const descriptionLines = doc.splitTextToSize(exp.description, maxWidth);
                descriptionLines.forEach(line => {
                    doc.text(line, rightColumnX, rightColumnY);
                    rightColumnY += 5;
                });
                rightColumnY += 10;
                requiredSpace += cvData.experience.length * 35;
                checkAndAddNewPage(requiredSpace);
            });
        }

        //doc.save('CV.pdf');
        // Convert the PDF to a Blob object
        const pdfBlob = doc.output('blob');
        const file = new File([pdfBlob], 'CV.pdf', {
            type: 'application/pdf',
            lastModified: Date.now()
        });
        // Send the PDF to the backend
        addCV(file)
    }

    const generatePDF = () => {
        const doc = new jsPDF();
        let styling = 76;

        // Add image (if available)
        if (cvData.image) {
            fileToBase64(cvData.image)
                .then(base64String => {
                    let imgData = 'data:image/jpeg;base64,'+ base64String;
                    // Left part of the CV is going to be brown
                    doc.setFillColor(188, 143, 143);
                    doc.rect(0, 0, 70, 300, 'F');
                    doc.addImage(imgData, 'JPEG', 13, 15, 45, 45);
                    // Add border to the photo
                    doc.setDrawColor(139, 69, 19);
                    doc.setLineWidth(0.5);
                    doc.rect(13, 15, 45, 45);
                    finishPDFGeneration(doc, styling)
                })
        }
        else{
            // Left part of the CV is going to be brown
            styling = 39;
            doc.setLineWidth(0.5);
            doc.setFillColor(188, 143, 143);
            doc.rect(0, 0, 70, 300, 'F');
            finishPDFGeneration(doc, styling)
        }
    };

    const uploadFile = () =>{
        addCV(cvFile)
    }

    /**
     * Render modal for uploading a CV
     */
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^(?=.*[a-zA-ZăâîșțĂÂÎȘȚ])([a-zA-ZăâîșțĂÂÎȘȚ\- ]*)$/;
    const phoneRegex = /^\d{10}$/;
    const addressRegex = /^[A-Za-zăâîșțĂÂÎȘȚ\d\s.,\-]+$/

    return (
        <div>
            <HeaderPageWithoutCV/>
            <div className="create-cv-container">
                <div className="candidate-cv-reason">
                    *{t('candidate_cv_reason')}
                </div>
                <div className="create-cv-header">
                    <Button onClick={() => {
                        setIsDialogOpen(true)
                    }} className="upload-already-existing-cv">
                        {t('candidate_cv_completed')}
                    </Button>
                    <span className="create-cv-or">{t('or')}</span>
                    <div className="cv-form-title">{t('fill_default_template')}</div>
                </div>
                {renderUploadCVDialog()}
                <div className="cv-form">
                    <div className="cv-form-general-section">
                        <div className="section-title">{t('general_info')}</div>
                        <ImageUpload onImageUpload={handleImageUpload}/>
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
                            <span className="section-title">{t('ed')}</span>
                            <Button onClick={()=>{
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
                                                    onClick={()=>{
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
                                                    onClick={()=> removeEducationField(index)}
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
                            <span className="section-title">{t('experience')}</span>
                            <Button onClick={()=>{
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
                                                    onClick={()=>{
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
                                                    onClick={()=> removeExperienceField(index)}
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
                    <Button onClick={generatePDF}
                            className="upload-already-existing-cv"
                            disabled={!emailRegex.test(cvData.email) ||
                                !usernameRegex.test(cvData.firstname) ||
                                !usernameRegex.test(cvData.lastname) ||
                                !phoneRegex.test(cvData.phone) ||
                                cvData.professionalSummary.length <= 100 ||
                                !addressRegex.test(cvData.address) ||
                                cvData.education.length === 0
                    }
                    >{t('create_cv')}</Button>
                </div>

            </div>
        </div>
    );
};

export default CreateCV;
