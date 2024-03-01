import React, {useEffect, useState} from 'react';
import {
    Button,
    Card,
    Dialog,
    DialogBody,
    DialogFooter,
    FormGroup,
    Icon,
    InputGroup,
    Intent,
    MenuItem,
    Position
} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";
import "./AddJobDialog.css";
import {useTranslation} from "react-i18next";
import {AppToaster} from "../common/AppToaster";
import JobService from "../../services/job.service";
import ReactQuill from "react-quill";
import {Stage} from "../../types/job.types";

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
        ['bold', 'italic', 'underline', 'strike'],
        [{'color': []}],
        [{'align': ''}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image'],
        ['clean']
    ]
};

const AddJobDialog = ({isDialogOpen, handleDialogAction}) => {

    // Constants
    const OTHERS = "Others"

    const {t, i18n} = useTranslation();

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
    // Job Stages
    const [stages, setStages] = useState([]); // All the stages
    const [selectedStages, setSelectedStages] = useState([]); // The selected stage and their type
    const [showInputGroup, setShowInputGroup] = useState(false);
    const [customStage, setCustomStage] = useState("");
    // Job Questions
    const [showQuestionSection, setShowQuestionSection] = useState(false);
    const [questions, setQuestions] = useState([]); // The questions
    // Errors
    const [titleError, setTitleError] = useState(false)
    const [descError, setDescError] = useState(false)

    useEffect(() => {
        setContractType(contracts[0]);
        setEmploymentRegime(regimes[0]);
        setIndustry(industries[0]);
        setWorkMode(works[0]);
        JobService.getAllStages()
            .then((response: any) => {
                let stagesResponse = response.data
                setStages([...stagesResponse])
                let defaultStages = [...response.data.slice(0, 3)]
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
        setStages([]);
        setSelectedStages([]);
        setShowInputGroup(false);
        setCustomStage("");
        setShowQuestionSection(false);
        setQuestions([]);
        setTitleError(false)
        setDescError(false)
    }

    /**
     * Handle description change
     *  @param {string} content
     *  @param {any} _delta
     *  @param {any} _source
     *  @param {any} _editor
     */
    const handleDescChange = (content, _delta, _source, _editor) => {
        setJobDescription(content);
    };

    /**
     * Handle stage addition
     *  @param {number} index
     */
    const handleAddStage = (index) => {
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
        const availableStages = stages.filter(stage => !selectedStages.some(selected => selected.stage.stageId === stage.stageId));
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
    const handleRemoveStage = (index) => {
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
    const handleStageSelect = (item, index) => {
        if (item.stageId === OTHERS) {
            setShowInputGroup(true);
            setCustomStage("")
        } else {
            setShowInputGroup(false);
        }
        let oldValues: Stage[] = [...selectedStages];
        let newItem = {
            stage: item,
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
    const handleQuestionChange = (text, index) => {
        let questionsCopy = [...questions]
        questionsCopy[index].questionText = text;
        setQuestions(questionsCopy)
    }

    /**
     * Used to add a new question
     * @param {number} index
     * @returns {any}
     */
    const handleAddQuestion = (index) => {
        let questionsCopy = [...questions]
        questionsCopy.push({questionText: "", questionNumber: questionsCopy.length})
        setQuestions(questionsCopy)
    }

    /**
     * Used to add a new question
     * @param {number} index
     * @returns {any}
     */
    const handleRemoveQuestion = (index) => {
        let questionsCopy = [...questions]
        if (questionsCopy.length === 1) {
            setShowQuestionSection(false)
            setQuestions([])
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
    const renderStageItem = (stage, {handleClick, modifiers, _query}) => {
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
    const renderContractType = (contractType: string, {handleClick, modifiers, _query}: any) => {
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
    const renderEmpRegimeType = (empRegime: string, {handleClick, modifiers, _query}: any) => {
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
    const renderIndustryType = (industry: string, {handleClick, modifiers, _query}: any) => {
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
    const renderWorkModeType = (workMode: string, {handleClick, modifiers, _query}: any) => {
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
    const renderExperienceType = (experience: string, {handleClick, modifiers, _query}: any) => {
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
            setTitleError(true)
            isValid = false;
        } else {
            setTitleError(false)
        }
        if (jobDescription.length < 100) {
            setDescError(true)
            isValid = false;
        } else {
            setDescError(false)
        }
        return isValid;
    }

    /**
     * Handle job form submit
     */
    const handleSubmit = () => {
        let fieldsValid = validateFields();
        if (fieldsValid) {
            console.log("TODO")
        }
        // Implement validation and backend call here
        /*const allStages = [...stages, ...customStages.map((stage, index) => ({
            stageName: stage.name,
            stageNr: index + 1
        }))]; // Combinați stagiile existente cu etapele personalizate
        if (allStages.length > 0) {
            // Trimiteți datele către backend
            // axios.post('/api/addJob', { stages: allStages })
            //     .then(response => {
            //         // Handle response
            //     })
            //     .catch(error => {
            //         // Handle error
            //     });
        } else {
            // Afisati o eroare că trebuie adăugată cel puțin o etapă
        }*/
    };

    const closeDialog = () => {
        resetFields();
        handleDialogAction();
    }

    let stageSelectOption = []
    if (stages.length > 0) {
        let justStages = selectedStages.map(stageObj => stageObj.stage)
        let filteredStages = stages.filter(stage => !justStages.includes(stage))
        stageSelectOption = [...filteredStages, {
            stageId: OTHERS,
            stageName: "Others (Altele)"
        }]
    }


    return (
        <Dialog
            isOpen={isDialogOpen}
            onClose={closeDialog}
            title={t('add_new_job_title')}
            canOutsideClickClose={false}
            usePortal={false}
            className="add-job-dialog"
        >
            <DialogBody>
                <div className="add-job-dialog-content">
                    <Card className="add-job-card">
                        <h4>
                            <Icon size={13} icon="briefcase"/>
                            {t('general_details')}
                        </h4>
                        <div className="add-job-details">
                            <FormGroup
                                label={t('job_title')}
                                labelFor="job-title"
                                labelInfo={t('required')}
                                intent={titleError ? "danger" : "none"}
                                helperText={titleError ? t('job_title_error') : ""}
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
                                intent={descError ? "danger" : "none"}
                                helperText={descError ? t('job_desc_error') : ""}
                                className="add-job-desc"
                            >
                                <ReactQuill
                                    theme="snow"
                                    value={jobDescription}
                                    onChange={handleDescChange}
                                    modules={modules}
                                />
                            </FormGroup>
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
                                        <Button text={employmentRegime} r
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
                    </Card>
                    <Card className="add-job-card">
                        <h4>
                            <Icon size={13} icon="path-search"/>
                            {t('stages')}
                        </h4>
                        <p>
                            Here you can add and remove stages for the job application process.
                        </p>
                        <div>
                            {selectedStages.map((stageValue, index) => (
                                <div key={index}>
                                    {index === selectedStages.length - 2 && index >= 2 ? (
                                        <React.Fragment>
                                            <Select
                                                items={stageSelectOption}
                                                fill={true}
                                                matchTargetWidth={true}
                                                filterable={true}
                                                itemRenderer={renderStageItem}
                                                onItemSelect={(e) => handleStageSelect(e, index)}
                                                popoverProps={{position: Position.BOTTOM_LEFT}}
                                                itemPredicate={filterStages}
                                            >
                                                <Button text={stageValue.stage.stageName + index}
                                                        rightIcon="double-caret-vertical"
                                                        fill={true}/>
                                            </Select>
                                            {showInputGroup && (
                                                <FormGroup
                                                    intent={customStage.length <= 0 || customStage.length >= 200 ? "danger" : "none"}
                                                    helperText={customStage.length <= 0 || customStage.length >= 200 ? "Stage must have between 1 and 200 length." : ""}
                                                >
                                                    <InputGroup
                                                        value={customStage}
                                                        onChange={(e) => setCustomStage(e.target.value)}
                                                        placeholder="Custom Stage"

                                                    />
                                                </FormGroup>
                                            )}
                                        </React.Fragment>
                                    ) : (
                                        <div>{stageValue.stage.stageName}</div>
                                    )}
                                    {(index === selectedStages.length - 2 && index >= 2) && (
                                        <div>
                                            <Button
                                                text={"Remove Stage" + index}
                                                onClick={() => handleRemoveStage(index)}
                                            />
                                        </div>
                                    )}
                                    {(index === selectedStages.length - 2 && index >= 1) && (
                                        <div>
                                            <Button
                                                text={"Add Stage After"}
                                                onClick={() => handleAddStage(index)}
                                                disabled={stageValue?.stage?.stageName === "Others" && (customStage.length <= 0 || customStage.length >= 200)}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                    {!showQuestionSection && <Button text={"Add Question Section"} onClick={() => {
                        setShowQuestionSection(true)
                        let questionToBeAdded = {questionText: "", questionNumber: 1}
                        setQuestions([questionToBeAdded])
                    }}></Button>}
                    {showQuestionSection &&
                        <Card className="add-job-card">
                            <h4>
                                <Icon size={13} icon="help"/>
                                {t('questions')}
                            </h4>
                            <p>
                                Here you can add questions for the job application process.
                            </p>
                            <div>
                                {questions.map((question, index) => (
                                    <div key={index}>
                                        <FormGroup
                                            intent={question.questionText.length < 10 || question.questionText.length >= 500 ? "danger" : "none"}
                                            helperText={question.questionText.length < 10 || question.questionText.length >= 500 ? "Question must have between 10 and 500 length." : ""}
                                        >
                                            <InputGroup
                                                value={question.questionText}
                                                onChange={(e) => handleQuestionChange(e.target.value, index)}
                                                placeholder="Add question text"

                                            />
                                        </FormGroup>
                                        <Button
                                            text={"Remove Question" + index}
                                            onClick={() => handleRemoveQuestion(index)}
                                        />
                                        <Button
                                            text={"Add Question After"}
                                            onClick={() => handleAddQuestion(index)}
                                            disabled={question.questionText.length < 10 || question.questionText.length >= 500}

                                        />
                                    </div>
                                ))}
                            </div>
                        </Card>}
                    <DialogFooter minimal={true} actions={
                        <div>
                            <Button intent="primary" onClick={handleSubmit}>{t('add')}</Button>
                            <Button onClick={closeDialog}>{t('cancel')}</Button>
                        </div>
                    }/>
                </div>
            </DialogBody>
        </Dialog>
    );
};

export default AddJobDialog;
