import React, {useEffect, useReducer, useState} from 'react';
import {
    Button,
    DialogStep,
    Divider,
    FormGroup,
    Icon,
    InputGroup,
    Intent,
    MenuItem,
    MultistepDialog,
    NonIdealState,
    NonIdealStateIconSize,
    Position,
    TextArea
} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";
import "./AddJobDialog.css";
import {useTranslation} from "react-i18next";
import {AppToaster} from "../common/AppToaster";
import JobService from "../../services/job.service";
import ReactQuill from "react-quill";
import {Stage} from "../../types/job.types";
import {useSelector} from "react-redux";

const industriesRo = [
    "Administrație", "Agricultură", "Arhitectură/Design interior", "Audit",
    "Bănci", "Chimie/Petrochimie", "Construcții/Instalații", "Educație", "Finanțe",
    "Imobiliare", "Inginerie", "IT Hardware", "IT Software", "Juridic", "Management", "Marketing",
    "Media/Jurnalism", "Psihologie", "Publicitate", "Radio/Televiziune", "Relații clienți",
    "Relații publice", "Resurse umane", "Telecomunicații",
    "Tipografie/Editură", "Traduceri", "Transport/Distribuție", "Turism", "Vânzări"
];

const industriesEng = [
    "Administration", "Agriculture", "Architecture/Interior Design", "Audit", "Banks",
    "Chemistry/Petro-chemistry", "Construction/Installations", "Education", "Finance",
    "Real Estate", "Engineering", "IT Hardware", "IT Software", "Legal", "Management", "Marketing",
    "Media/Journalism", "Psychology", "Advertising", "Radio/Television", "Customer Relations",
    "Public Relations", "Human Resources", "Telecommunications",
    "Printing/Publishing", "Translations", "Transportation/Distribution", "Tourism", "Sales"
];

const experiencesRo = [
    {label: "Entry-Level", years: " (0 ani)"},
    {label: "Junior", years: " (0-2 ani)"},
    {label: "Intermediar", years: " (2-4 ani)"}
];

const experiencesEng = [
    {label: "Entry-Level", years: " (0 years)"},
    {label: "Junior", years: " (0-2 years)"},
    {label: "Intermediary", years: " (2-4 years)"}
];

const contractEn = ["Full-time", "Part-time", "Freelance"]
const contractRo = ["Full-time", "Part-time", "Variabil"]

const regimeEn = ["Internship", "Project", "Fixed-term Contract", "Indefinite-term Contract"]
const regimeRo = ["Stagiu", "Proiect", "Contract determinat", "Contract nedeterminat"]

const workEn = ["On-Site", "Remote", "Hybrid"]
const workRo = ["La birou", "La distanță", "Hibrid"]

const modules = {
    toolbar: [
        [{'header': [1, 2, false]}],
        ['bold', 'italic', 'underline'],
        [{'color': []}],
        [{'align': ''}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image'],
        ['clean']
    ]
};

const AddJobDialog = ({isDialogOpen, handleDialogAction, handleJobAddition}: any) => {

    // Constants
    const OTHERS = "Others"
    const STAGE1 = "The candidate submitted a resume (Candidatul a depus un CV)"
    const STAGE2 = "Employer viewed the application (Angajatorul a vizualizat aplicarea)"
    const STAGE3 = "The applicant has been hired (Candidatul a fost angajat)"

    const {t, i18n} = useTranslation();
    const employer = useSelector((state: any) => state.auth.employer);

    const industries = i18n.language === "ro" ? industriesRo : industriesEng
    const experiences = i18n.language === "ro" ? experiencesRo : experiencesEng
    const contracts = i18n.language === "ro" ? contractRo : contractEn
    const regimes = i18n.language === "ro" ? regimeRo : regimeEn
    const works = i18n.language === "ro" ? workRo : workEn

    // Job General Details
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [contractType, setContractType] = useState(contracts[0]);
    const [employmentRegime, setEmploymentRegime] = useState(regimes[0]);
    const [industry, setIndustry] = useState(industries[0]);
    const [workMode, setWorkMode] = useState(works[0]);
    const [experience, setExperience] = useState('Entry-Level');
    const [cityName, setCityName] = useState('');
    const [regionName, setRegionName] = useState('');
    const [countryName, setCountryName] = useState('');
    // Job Stages
    const [stages, setStages] = useState<any>([]); // All the stages
    const [selectedStages, setSelectedStages] = useState<any>([]); // The selected stage and their type
    const [showInputGroup, setShowInputGroup] = useState(false);
    const [customStage, setCustomStage] = useState("");
    // Job Questions
    const [showQuestionSection, setShowQuestionSection] = useState(false);
    const [questions, setQuestions] = useState([]); // The questions

    useEffect(() => {
        setContractType(contracts[0]);
        setEmploymentRegime(regimes[0]);
        setIndustry(industries[0]);
        setWorkMode(works[0]);
        JobService.getAllStages()
            .then((response: any) => {
                let stagesResponse = response.data
                setStages([...stagesResponse])
                let stage1 = stagesResponse.filter((stage:any) => stage.stageName === STAGE1)[0]
                let stage2 = stagesResponse.filter((stage:any) => stage.stageName === STAGE2)[0]
                let stage3 = stagesResponse.filter((stage:any) => stage.stageName === STAGE3)[0]
                let defaultStages = [stage1, stage2, stage3]
                let defaultValues = defaultStages.map((stage: Stage, index: number) => {
                    return {
                        stage: stage,
                        nrStage: index,
                        isCustom: false,
                        isSelected: false,
                    }
                })
                setSelectedStages([...defaultValues])
            })
            .catch(error => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('stages_error'),
                    intent: Intent.DANGER,
                });
            });
    }, [isDialogOpen]);

    /**
     * Reset fields when the modal is closed
     */
    const resetFields = () => {
        setJobTitle("");
        setJobDescription("");
        setContractType(contracts[0]);
        setEmploymentRegime(regimes[0]);
        setIndustry(industries[0]);
        setWorkMode(works[0]);
        setExperience('Entry-Level');
        setCityName("");
        setCountryName("")
        setRegionName("")
        setStages([]);
        setSelectedStages([]);
        setShowInputGroup(false);
        setCustomStage("");
        setShowQuestionSection(false);
        setQuestions([]);
    }

    /**
     * Handle description change
     *  @param {string} content
     *  @param {any} _delta
     *  @param {any} _source
     *  @param {any} _editor
     */
    const handleDescChange = (content: any, _delta: any, _source: any, _editor: any) => {
        setJobDescription(content);
    };

    /**
     * Handle stage addition
     *  @param {number} index
     */
    const handleAddStage = (index: number) => {
        let oldValues: Stage[] = [...selectedStages];
        let currentItem = selectedStages[index]
        let beforeItem;
        if (currentItem.stage.stageId === OTHERS) {
            beforeItem = {
                stage: {stageId: OTHERS + index, stageName: customStage},
                nrStage: index + 1,
                isCustom: true,
                isSelected: true,
            }
        } else {
            beforeItem = {...oldValues[index]}
        }
        const availableStages = stages.filter((stage: any) => !selectedStages.some((selected: any) => selected.stage.stageId === stage.stageId));
        const firstAvailableStage = availableStages[0];
        // Insert the new stage between the last and penultimate stages
        let newItem = {
            stage: firstAvailableStage,
            nrStage: index + 1,
            isCustom: false,
            isSelected: true,
        }
        let lastItem = {...oldValues[oldValues.length - 1], nrStage: index + 2}
        let newValues = [...oldValues.slice(0, index), beforeItem, newItem, lastItem]
        setSelectedStages(newValues);
        setCustomStage("");
        setShowInputGroup(false);
    };

    /**
     *  Handle stage removal
     *  @param {number} index
     */
    const handleRemoveStage = (index: number) => {
        let oldValues: Stage[] = [...selectedStages];
        let oldSelectedItem = selectedStages[index - 1]
        let newSelectedItem;
        if (oldSelectedItem.stage.stageId.includes(OTHERS)) {
            // The field is custom
            newSelectedItem = {
                stage: {stageId: OTHERS, stageName: "Others (Altele)"},
                nrStage: index + 1,
                isCustom: true,
                isSelected: true,
            }
            setCustomStage(oldSelectedItem.stage.stageName)
            setShowInputGroup(true)
        } else {
            newSelectedItem = oldSelectedItem
            setCustomStage("")
            setShowInputGroup(false)
        }
        let lastItem = {...oldValues[oldValues.length - 1], nrStage: index + 1}
        let newValues = [...oldValues.slice(0, index - 1), newSelectedItem, lastItem]
        setSelectedStages(newValues);
    };

    /**
     * Handle stage selection
     *  @param {any} item
     *  @param {number} index
     */
    const handleStageSelect = (item: any, index: number) => {
        let itemStage = stages.filter((stage: any) => stage.stageName === item)[0]
        if (item === "Others (Altele)") {
            setShowInputGroup(true);
            itemStage = {
                stageId: OTHERS,
                stageName: item
            }
            setCustomStage("")
        } else {
            setShowInputGroup(false);
        }
        let oldValues: Stage[] = [...selectedStages];
        let newItem = {
            stage: itemStage,
            nrStage: index,
            isCustom: false,
            isSelected: true,
        }
        let newValues = [...oldValues.slice(0, index), newItem,
            ...oldValues.slice(index + 1, oldValues.length)]
        setSelectedStages(newValues);
    };

    /**
     * Used to switch the current work mode
     * @param {string} workMode
     */
    const handleWorkModeSwitch = (workMode: string) => {
        setWorkMode(workMode);
    };

    /**
     * Used to switch the current contract type
     * @param {string} contract
     */
    const handleContractSwitch = (contract: string) => {
        setContractType(contract);
    };

    /**
     * Used to switch the current employment regime
     * @param {string} empRegime
     */
    const handleEmpRegimeSwitch = (empRegime: string) => {
        setEmploymentRegime(empRegime);
    };

    /**
     * Used to switch the current experience
     * @param {string} experience
     */
    const handleExperienceSwitch = (experience: string) => {
        setExperience(experience);
    };

    /**
     * Used to switch the current industry
     * @param {string} industry
     */
    const handleIndustrySwitch = (industry: string) => {
        setIndustry(industry);
    };

    /**
     * Used to update the current question text
     * @param {string} text
     * @param {number} index
     * @returns {any}
     */
    const handleQuestionChange = (text: string, index: number): any => {
        let questionsCopy: any = [...questions]
        questionsCopy[index].questionText = text;
        setQuestions(questionsCopy)
    }

    /**
     * Used to add a new question
     */
    const handleAddQuestion = () => {
        let questionsCopy: any = [...questions]
        questionsCopy.push({questionText: "", questionNumber: questionsCopy.length})
        setQuestions(questionsCopy)
    }

    /**
     * Used to add a new question
     */
    const handleRemoveQuestion = () => {
        let questionsCopy = [...questions]
        if (questionsCopy.length === 1) {
            setShowQuestionSection(false)
            questionsCopy = []
        } else {
            questionsCopy.pop()
        }
        setQuestions(questionsCopy)
    }

    /**
     * Used for searching the industries
     * @param query The rule against the item is checked
     * @param item Item to be checked
     * @param _index
     * @param _exactMatch
     * @returns
     */
    const filterIndustries = (query: any, item: any, _index: any, _exactMatch: any) => {
        return item.toLowerCase().indexOf(query.toLowerCase()) > -1;
    };

    /**
     * Used for searching the stages
     * @param query The rule against the item is checked
     * @param item Item to be checked
     * @param _index
     * @param _exactMatch
     * @returns
     */
    const filterStages = (query: any, item: any, _index: any, _exactMatch: any) => {
        return item.toLowerCase().indexOf(query.toLowerCase()) > -1;
    };

    /**
     * Renders stage item
     * @param {any} stage
     * @param {any} handleClick
     * @param {any} modifiers
     * @param {any} _query
     * @returns {any}
     */
    const renderStageItem = (stage: any, {handleClick, modifiers, _query}: any): any => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem active={modifiers.active}
                      disabled={modifiers.disabled}
                      text={stage}
                      key={stage}
                      onClick={handleClick}
                      shouldDismissPopover={true}
            />
        );
    };

    /**
     * Renders contract type item
     * @param {string} contractType
     * @param {any} handleClick
     * @param {any} modifiers
     * @param {any} _query
     * @returns {any}
     */
    const renderContractType = (contractType: string, {handleClick, modifiers, _query}: any): any => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem active={modifiers.active}
                      disabled={modifiers.disabled}
                      text={contractType}
                      key={contractType}
                      onClick={handleClick}
                      shouldDismissPopover={true}
            />
        );
    };

    /**
     * Renders employment regime item
     * @param {string} empRegime
     * @param {any} handleClick
     * @param {any} modifiers
     * @param {any} _query
     * @returns {any}
     */
    const renderEmpRegimeType = (empRegime: string, {handleClick, modifiers, _query}: any): any => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem active={modifiers.active}
                      disabled={modifiers.disabled}
                      text={empRegime}
                      key={empRegime}
                      onClick={handleClick}
                      shouldDismissPopover={true}
            />
        );
    };

    /**
     * Renders industry item
     * @param {string} industry
     * @param {any} handleClick
     * @param {any} modifiers
     * @param {any} _query
     * @returns {any}
     */
    const renderIndustryType = (industry: string, {handleClick, modifiers, _query}: any): any => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem active={modifiers.active}
                      disabled={modifiers.disabled}
                      text={industry}
                      key={industry}
                      onClick={handleClick}
                      shouldDismissPopover={true}
            />
        );
    };

    /**
     * Renders work mode item
     * @param {string} workMode
     * @param {any} handleClick
     * @param {any} modifiers
     * @param {any} _query
     * @returns {any}
     */
    const renderWorkModeType = (workMode: string, {handleClick, modifiers, _query}: any): any => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem active={modifiers.active}
                      disabled={modifiers.disabled}
                      text={workMode}
                      key={workMode}
                      onClick={handleClick}
                      shouldDismissPopover={true}
            />
        );
    };

    /**
     * Renders experience item
     * @param {string} experience
     * @param {any} handleClick
     * @param {any} modifiers
     * @param {any} _query
     * @returns {any}
     */
    const renderExperienceType = (experience: string, {handleClick, modifiers, _query}: any): any => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem active={modifiers.active}
                      disabled={modifiers.disabled}
                      text={experience}
                      key={experience}
                      onClick={handleClick}
                      shouldDismissPopover={true}
            />
        );
    };


    /**
     * Validate fields on submission
     */
    const validateFields = () => {
        let isValid = true;
        if (jobTitle.length < 5 || jobTitle.length > 500) {
            isValid = false;
        }
        if (jobDescription.length < 100) {
            isValid = false;
        }
        if (questions.filter((q: any) => q.questionText.length < 10 || q.questionText.length >= 500).length > 0) {
            isValid = false
        }
        return isValid;
    }

    /**
     * Add job
     */
    const addJob = (request: any) => {
        JobService.addJob(request)
            .then(() => {
                AppToaster.show({
                    message: t('create_job_success'),
                    intent: Intent.SUCCESS,
                });
                handleJobAddition();
                closeDialog();
            })
            .catch(error => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('create_job_err'),
                    intent: Intent.DANGER,
                });
            });
    }

    /**
     * Handle job form submit
     */
    const handleSubmit = () => {
        let fieldsValid = validateFields();
        if (fieldsValid) {
            let workModeDb;
            if (workMode === "La distanță" || workMode === "Remote") {
                workModeDb = "Remote";
            } else if (workMode === "La birou" || workMode === "On-Site") {
                workModeDb = "On-Site";
            } else {
                workModeDb = "Hibrid";
            }
            let employmentRegimeDb;
            if (employmentRegime === "Stagiu" || employmentRegime === "Internship") {
                employmentRegimeDb = "Stagiu";
            } else if (employmentRegime === "Proiect" || employmentRegime === "Project") {
                employmentRegimeDb = "Proiect";
            } else if (employmentRegime === "Contract determinat" || employmentRegime === "Fixed-term Contract") {
                employmentRegimeDb = "Contract determinat";
            } else {
                employmentRegimeDb = "Contract nedeterminat";
            }
            let experienceDb;
            if (experience === "Entry-Level") {
                experienceDb = "Entry-Level";
            } else if (experience === "Junior") {
                experienceDb = "Junior";
            } else {
                experienceDb = "Intermediar";
            }
            let contractTypeDb;
            if (contractType === "Norma întreagă" || contractType === "Full-time") {
                contractTypeDb = "Norma intreaga";
            } else if (contractType === "Norma redusă" || contractType === "Part-time") {
                contractTypeDb = "Norma redusa";
            } else {
                contractTypeDb = "Norma variabila";
            }
            let request = {
                title: jobTitle,
                description: jobDescription,
                contractType: contractTypeDb,
                employmentRegime: employmentRegimeDb,
                experience: experienceDb,
                workMode: workModeDb,
                industry: industry,
                cityName: cityName,
                regionName: regionName,
                countryName: countryName,
                questions: questions.map((q: any) => {
                    return {
                        questionText: q.questionText,
                        questionNumber: q.questionNumber
                    }
                }),
                stages: selectedStages.map((s: any) => {
                    if (s.stage.stageId === OTHERS && customStage !== "")
                        return {
                            stageName: customStage,
                            stageNr: s.nrStage
                        }
                    else {
                        return {
                            stageName: s.stage.stageName,
                            stageNr: s.nrStage
                        }
                    }
                }),
                employerId: employer.employerId,
            }
            addJob(request)
        }
    };

    const closeDialog = () => {
        resetFields();
        handleDialogAction();
    }

    let stageSelectOption: any[] = []
    if (stages.length > 0) {
        let justStages = selectedStages.map((stageObj: any) => stageObj.stage)
        let filteredStages = stages.filter((stage: any) => !justStages.includes(stage))
        let stageNamesStages = filteredStages.map((stageObj: any) => stageObj.stageName)
        stageSelectOption = [...stageNamesStages, "Others (Altele)"]
    }
    // @ts-ignore
    return (
        <MultistepDialog
            isOpen={isDialogOpen}
            onClose={closeDialog}
            title={t('add_new_job_title')}
            canOutsideClickClose={false}
            usePortal={true}
            className="add-job-dialog"
            finalButtonProps={{
                intent: "success", onClick: handleSubmit, text: t('add'),
                disabled: questions.filter((q: any) => q.questionText.length < 10 || q.questionText.length >= 500).length > 0
            }}
        >
            <DialogStep
                id="step1"
                nextButtonProps={{
                    intent: "success",
                    text: t('next_step'),
                    disabled: jobDescription.length < 100 || jobTitle.length < 5 || jobTitle.length > 500
                }}
                title={t('general_details_dialog')}
                panel={
                    <div className="add-job-card">
                        <h4>
                            <Icon size={13} icon="briefcase"/>
                            {t('general_details')}
                        </h4>
                        <div className="add-job-general-details">
                            <FormGroup
                                label={t('job_title')}
                                labelFor="job-title"
                                labelInfo={t('required')}
                                intent={jobTitle.length < 5 || jobTitle.length > 500 ? "danger" : "none"}
                                helperText={jobTitle.length < 5 || jobTitle.length > 500 ? t('job_title_error') : ""}
                            >
                                <InputGroup
                                    value={jobTitle}
                                    placeholder="Ex: Software Engineer"
                                    autoComplete="new-job"
                                    asyncControl={true}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup
                                label={t('job_desc')}
                                labelFor="job-description"
                                labelInfo={t('required')}
                                intent={jobDescription.length < 100 ? "danger" : "none"}
                                helperText={jobDescription.length < 100 ? t('job_desc_error') : ""}
                                className="add-job-desc"
                            >
                                <ReactQuill
                                    theme="snow"
                                    value={jobDescription}
                                    onChange={handleDescChange}
                                    modules={modules}
                                />
                            </FormGroup>
                        </div>
                    </div>}
            />
            <DialogStep
                id="step2"
                nextButtonProps={{
                    disabled: (!countryName || (countryName && !/^[A-Za-zăâîșțĂÂÎȘȚ\s\-]*$/u.test(countryName)))
                        || (!cityName || (cityName && !/^[A-Za-zăâîșțĂÂÎȘȚ\s\-]*$/u.test(cityName))) || (
                            !regionName || (regionName && !/^[A-Za-zăâîșțĂÂÎȘȚ\s\-]*$/u.test(regionName))
                        ) || false,
                    intent: "success",
                    text: t('next_step')
                }}
                backButtonProps={{
                    intent: "none",
                    text: t('prev_step'),
                }}
                title={t('work_mode_dialog')}
                panel={
                    <div className="add-job-card">
                        <h4>
                            <Icon size={13} icon="build"/>
                            {t('work_mode_details')}
                        </h4>
                        <div className="add-job-work">
                            <div className="add-job-address">
                                <FormGroup
                                    label={t('city')}
                                    intent={!cityName || (cityName && !/^[A-Za-zăâîșțĂÂÎȘȚ\s\-]*$/.test(cityName)) ? Intent.DANGER : Intent.NONE}
                                    helperText={!cityName || (cityName && !/^[A-Za-zăâîșțĂÂÎȘȚ\s\-]*$/.test(cityName)) ? t('city_err_job') : ""}
                                    labelInfo={t('required')}
                                >
                                    <InputGroup
                                        type="text"
                                        name="city"
                                        value={cityName}
                                        onChange={(e) => setCityName(e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup
                                    label={t('region')}
                                    intent={!regionName || (regionName && !/^[A-Za-zăâîșțĂÂÎȘȚ\s\-]*$/.test(regionName)) ? Intent.DANGER : Intent.NONE}
                                    helperText={!regionName || (regionName && !/^[A-Za-zăâîșțĂÂÎȘȚ\s\-]*$/.test(regionName)) ? t('city_err_job') : ""}
                                    labelInfo={t('required')}
                                >
                                    <InputGroup
                                        type="text"
                                        name="region"
                                        value={regionName}
                                        onChange={(e) => setRegionName(e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup
                                    label={t('country')}
                                    intent={!countryName || (countryName && !/^[A-Za-zăâîșțĂÂÎȘȚ\s\-]*$/.test(countryName)) ? Intent.DANGER : Intent.NONE}
                                    helperText={!countryName || (countryName && !/^[A-Za-zăâîșțĂÂÎȘȚ\s\-]*$/.test(countryName)) ? t('city_err_job') : ""}
                                    labelInfo={t('required')}
                                >
                                    <InputGroup
                                        type="text"
                                        name="country"
                                        value={countryName}
                                        onChange={(e) => setCountryName(e.target.value)}
                                    />
                                </FormGroup>
                            </div>
                            <Divider/>
                            <div className="general-details-select">
                                <FormGroup
                                    label={t('contract_type')}
                                    labelFor="contract-type"
                                >
                                    <Select items={contracts}
                                            fill={true}
                                            matchTargetWidth={true}
                                            filterable={false}
                                            itemRenderer={renderContractType}
                                            onItemSelect={(e) => handleContractSwitch(e)}
                                            popoverProps={{position: Position.RIGHT}}
                                    >
                                        <Button text={contractType}
                                                rightIcon="double-caret-vertical"
                                                fill={true}/>
                                    </Select>
                                </FormGroup>
                                <FormGroup
                                    label={t('employment_regime')}
                                    labelFor="employment-regime"
                                >
                                    <Select
                                        items={regimes}
                                        fill={true}
                                        matchTargetWidth={true}
                                        filterable={false}
                                        itemRenderer={renderEmpRegimeType}
                                        onItemSelect={(e) => handleEmpRegimeSwitch(e)}
                                        popoverProps={{position: Position.RIGHT}}
                                    >
                                        <Button text={employmentRegime}
                                                rightIcon="double-caret-vertical"
                                                fill={true}/>
                                    </Select>
                                </FormGroup>
                                <FormGroup
                                    label={t('industry')}
                                    labelFor="industry"
                                >
                                    <Select
                                        items={industries}
                                        fill={true}
                                        matchTargetWidth={true}
                                        filterable={true}
                                        itemRenderer={renderIndustryType}
                                        onItemSelect={(e) => handleIndustrySwitch(e)}
                                        itemPredicate={filterIndustries}
                                        popoverProps={{position: Position.LEFT}}
                                    >
                                        <Button text={industry}
                                                rightIcon="double-caret-vertical"
                                                fill={true}/>
                                    </Select>
                                </FormGroup>
                                <FormGroup
                                    label={t('work_mode')}
                                    labelFor="work-mode"
                                >
                                    <Select
                                        items={works}
                                        fill={true}
                                        matchTargetWidth={true}
                                        filterable={false}
                                        itemRenderer={renderWorkModeType}
                                        onItemSelect={(e) => handleWorkModeSwitch(e)}
                                        popoverProps={{position: Position.RIGHT}}
                                    >
                                        <Button text={workMode} rightIcon="double-caret-vertical"
                                                fill={true}/>
                                    </Select>
                                </FormGroup>
                                <FormGroup
                                    label={t('experience')}
                                    labelFor="experience"
                                >
                                    <Select
                                        items={experiences.map(exp => exp.label)}
                                        fill={true}
                                        matchTargetWidth={true}
                                        filterable={false}
                                        itemRenderer={renderExperienceType}
                                        onItemSelect={(e) => handleExperienceSwitch(e)}
                                        popoverProps={{position: Position.RIGHT}}
                                    >
                                        <Button text={experience}
                                                rightIcon="double-caret-vertical"
                                                fill={true}/>
                                    </Select>
                                </FormGroup>
                                <FormGroup
                                    label=""
                                    labelFor="empty"
                                >
                                </FormGroup>
                            </div>
                        </div>
                    </div>
                }
            />
            <DialogStep
                id="step3"
                nextButtonProps={{
                    intent: "success",
                    text: t('next_step'),
                    disabled: (selectedStages.filter((stageObj: any) => stageObj.stage.stageId === OTHERS
                            && stageObj.stage.stageName === "Others (Altele)" && (customStage.length <= 0 || customStage.length >= 200)).length > 0)
                        || selectedStages.length <= 3
                }}
                backButtonProps={{
                    intent: "none",
                    text: t('prev_step'),
                }}
                title={t('stages_dialog')}
                panel={
                    <div className="add-job-card">
                        <h4>
                            <Icon size={13} icon="path-search"/>
                            {t('stages')}
                        </h4>
                        <p className="stages_p">
                            {t('stages_p')}
                        </p>
                        <div className="stage-container">
                            {selectedStages.map((stageValue: any, index: number) => (
                                <div className="stage-item-with-arrow">
                                    <div key={index} className="stage-item-general">
                                        {index === selectedStages.length - 2 && index >= 2 ? (
                                            <div className="stage-item-select">
                                                <div className="stage-item-select-choose">
                                                    *{t('choose_stage') + " " + t('stage_nr') + " " + (index + 1)}:
                                                </div>
                                                <div className="select-wrapper">
                                                    <Select
                                                        items={stageSelectOption}
                                                        fill={true}
                                                        matchTargetWidth={true}
                                                        filterable={true}
                                                        itemRenderer={renderStageItem}
                                                        onItemSelect={(e) => handleStageSelect(e, index)}
                                                        itemPredicate={filterStages}
                                                    >
                                                        <Button
                                                            text={stageValue.stage.stageName}
                                                            rightIcon="double-caret-vertical"
                                                            fill={true}/>
                                                    </Select>
                                                </div>
                                                {showInputGroup && (
                                                    <FormGroup
                                                        intent={customStage.length <= 0 || customStage.length >= 200 ? "danger" : "none"}
                                                        helperText={customStage.length <= 0 || customStage.length >= 200 ? t('custom_stage_err') : ""}
                                                    >
                                                        <InputGroup
                                                            value={customStage}
                                                            onChange={(e) => setCustomStage(e.target.value)}
                                                            placeholder={t('add_custom_stage')}
                                                        />
                                                    </FormGroup>
                                                )}
                                            </div>
                                        ) : (
                                            <div key={index} className="stage-item">
                                                <div className="stage-name">
                                                    {t('stage_nr') + " " + (index + 1)}. {stageValue.stage.stageName}
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                    <div className="add-stage-buttons">
                                        {(index === selectedStages.length - 2 && index >= 2) && (
                                            <div>
                                                <Button intent="warning"
                                                        className="btn-remove-stage"
                                                        text={t('remove_stage')}
                                                        onClick={() => handleRemoveStage(index)}
                                                        small={true}
                                                />
                                            </div>
                                        )}
                                        {(index === selectedStages.length - 2 && index >= 1) && (
                                            <div>

                                                <Button intent="primary"
                                                        className="btn-add-stage"
                                                        onClick={() => handleAddStage(index)}
                                                        text={t('add_stage')}
                                                        disabled={stageValue?.stage?.stageId === "Others"
                                                            && (customStage.length <= 0 || customStage.length >= 200)}
                                                        small={true}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            />
            <DialogStep
                id="step4"
                backButtonProps={{
                    intent: "none",
                    text: t('prev_step'),
                }}
                title={t('question_dialog')}
                panel={
                    <div className="add-job-card">
                        <h4>
                            <Icon size={13} icon="help"/>
                            {t('questions')}
                        </h4>
                        <p className="stages_p">
                            {t('question_p')}
                        </p>
                        <div>
                            {!showQuestionSection &&
                                <div className="show-question-section">
                                    <Button
                                        text={t('add_question_section')}
                                        onClick={() => {
                                            setShowQuestionSection(true)
                                            handleAddQuestion()
                                        }}
                                        intent={Intent.SUCCESS}
                                    />
                                    <NonIdealState
                                        iconSize={NonIdealStateIconSize.STANDARD}
                                        icon={"info-sign"}
                                        title={t('questions_info_sign')}
                                        description={t('question_info_desc')}
                                        layout="vertical"
                                    />
                                </div>
                            }
                            {showQuestionSection &&
                                <div className="questions-section">
                                    {questions.map((question: any, index: number) => (
                                        <div key={index} className="question-section">
                                            <FormGroup
                                                intent={question.questionText.length < 10 || question.questionText.length >= 500 ? "danger" : "none"}
                                                helperText={question.questionText.length < 10 || question.questionText.length >= 500 ? t('question_err') : ""}
                                                label={t('the_question') + " " + (index + 1) + ":"}
                                            >
                                                <TextArea
                                                    value={question.questionText}
                                                    onChange={(e) => handleQuestionChange(e.target.value, index)}
                                                    placeholder={t('question_placeholder')}
                                                    rows={3}
                                                    style={{width: "100%", resize: "none"}}
                                                />
                                            </FormGroup>
                                            {index === questions.length - 1 &&
                                                <div className="add-stage-buttons">
                                                    <Button intent="warning"
                                                            className="btn-remove-stage"
                                                            text={t('remove_question')}
                                                            onClick={() => handleRemoveQuestion()}
                                                            small={true}
                                                    />
                                                    <Button intent="primary"
                                                            className="btn-add-stage"
                                                            text={t('add_question')}
                                                            onClick={() => handleAddQuestion()}
                                                            disabled={question.questionText.length < 10 || question.questionText.length >= 500}
                                                            small={true}
                                                    />
                                                </div>
                                            }
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    </div>
                }
            />
        </MultistepDialog>
    );
};

export default AddJobDialog;
