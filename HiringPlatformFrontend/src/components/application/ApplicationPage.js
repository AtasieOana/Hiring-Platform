import React, {useEffect, useState} from 'react';
import "./ApplicationPage.css";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {AppToaster} from "../common/AppToaster";
import {
    Button, Card, Checkbox,
    Classes, Dialog, DialogBody, DialogFooter, Divider, Drawer,
    FormGroup, H3, H5,
    Icon,
    InputGroup,
    Intent, MenuItem,
    NonIdealState,
    Position, TextArea, Tooltip
} from "@blueprintjs/core";
import AppService from "../../services/app.service";
import {Select} from "@blueprintjs/select";
import SearchIcon from "../../resources-photo/svg/no_job.svg";
import JobService from "../../services/job.service";
import {dateEn, dateRo, possibleDates} from "../job/JobsPage";
import HeaderPageCandidate from "../header/HeaderPageCandidate";
import HeaderPageEmployer from "../header/HeaderPageEmployer";
import {formatDate, handleOpenCV, useMediaQuery} from "../common/CommonMethods";
import {useNavigate} from "react-router-dom";
import {setJobData} from "../../redux/actions/jobActions";

export const possibleStatus = ['refuzat', 'in_curs', 'finalizat']
export const statusEn = ['Refused', 'In Progress', 'Completed']
export const statusRo = ['Refuzat', 'În curs', 'Finalizat']

const ApplicationPage = () => {

    const {t, i18n} = useTranslation();
    const employer = useSelector(state => state.auth.employer);
    const candidate = useSelector(state => state.auth.candidate);
    const openedJob = useSelector(state => state.job.jobDetails);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const status = i18n.language === "ro" ? statusRo : statusEn
    const date = i18n.language === "ro" ? dateRo : dateEn

    const [apps, setApps] = useState([])
    const [filteredApps, setFilteredApps] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [orderByPostDate, setOrderByPostDate] = useState(0)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [currentApp, setCurrentApp] = useState(null);
    const [isStopDialogOpen, setIsStopDialogOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [reasonValid, setReasonValid] = useState(true);

    const [filters, setFilters] = useState({
        status: possibleStatus,
        stageName: [],
        companyName: [],
        postingDate: possibleDates[0],
    });

    const [stagesName, setStagesName] = useState([])
    const [companiesName, setCompaniesName] = useState([])

    // Paginating
    const [currentPage, setCurrentPage] = useState(1);
    const appsPerPage = 4; // Number of apps per page
    const [paginatingApps, setPaginatingApp] = useState([]);
    const isSmallScreen = useMediaQuery("(max-width: 900px)");


    useEffect(() => {
        if(candidate && candidate.candidateId !== ""){
            getAllApplicationsForCandidate()
        }
        else{
            getAllApplicationsForJob()
        }
    }, []);

    const getAllApplicationsForJob = () =>{
        AppService.getAllApplicationsForJob(openedJob.jobId).then((response) => {
            let appResponse = response.data
            getAllStagesForJob()
            setApps(appResponse)
            setFilteredApps(appResponse)
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('apps_retrieval_err'),
                intent: Intent.DANGER,
            });
        });
    }

    const  getAllApplicationsForCandidate = () =>{
        AppService.getAllApplicationsForCandidate(candidate.candidateId).then((response) => {
            let appResponse = response.data
            let companyResponse = [...new Set(appResponse.map(j => j.employerCompanyName))];
            setCompaniesName(companyResponse)
            setApps(response.data)
            let filtersApps = {...filters}
            filtersApps.companyName = companyResponse;
            setFilters(filtersApps)
            setFilteredApps(appResponse)
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('apps_retrieval_err'),
                intent: Intent.DANGER,
            });
        });
    }

    const  getAllStagesForJob = () =>{
        JobService.getStagesForJob(openedJob.jobId).then((response) => {
            let stageResponse = [...new Set(response.data.map(j => j.stageName))];
            setStagesName(stageResponse)
            let filtersApps = {...filters}
            filtersApps.stageName = stageResponse;
            setFilters(filtersApps)
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('apps_retrieval_err'),
                intent: Intent.DANGER,
            });
        });
    }

    /**
     * Method that handle the filtering
     */
    useEffect(() => {
        if(employer && employer.employerId !== ""){
            filterForEmp()
        }
        else{
            filterForCan()
        }
    }, [apps, filters, searchTerm, orderByPostDate]);

    const filterForCan = () => {
        setCurrentPage(1)
        // Filter by contract type
        let allApps = [...apps]
        let filtered = allApps.filter(app =>
            app.job.title.toLowerCase().includes(searchTerm)
            && filters.status.includes(app.status)
            && filters.companyName.includes(app.employerCompanyName)
            && filterByDate(filters.postingDate, app.appDate))
        if(orderByPostDate === 1) {
            filtered.sort((a, b) => new Date(a.appDate) - new Date(b.appDate));
        }
        else{
            filtered.sort((a, b) => new Date(b.appDate) - new Date(a.appDate));
        }
        setFilteredApps(filtered);
        paginate(filtered, 1);
    }

    const filterForEmp = () =>{
        setCurrentPage(1)
        // Filter by contract type
        let allApps = [...apps]
        let filtered = allApps.filter(app =>
            (app.candidateLastname.toLowerCase().includes(searchTerm)
                || app.candidateFirstname.toLowerCase().includes(searchTerm))
            && filters.status.includes(app.status)
            && filters.stageName.includes(app.stageName)
            && filterByDate(filters.postingDate, app.appDate))
        if(orderByPostDate === 1) {
            filtered.sort((a, b) => new Date(a.appDate) - new Date(b.appDate));
        }
        else{
            filtered.sort((a, b) => new Date(b.appDate) - new Date(a.appDate));
        }
        setFilteredApps(filtered);
        paginate(filtered, 1);
    }

    /**
     * Return true if the job is posted in the selected time, false otherwise
     * @param {string} filtersDate
     * @param {string} date
     */
    const filterByDate = (filtersDate, date) =>  {
        // Anytime
        if (filtersDate === possibleDates[0]) {
            return true
        }
        // Past month
        if (filtersDate === possibleDates[1]) {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            if (new Date(date) >= oneMonthAgo) {
                return true;
            }
        }
        // Past week
        if (filtersDate === possibleDates[2]) {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            if (new Date(date) >= oneWeekAgo) {
                return true;
            }
        }
        // Past day
        if (filtersDate === possibleDates[3]) {
            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);
            if (new Date(date) >= oneDayAgo) {
                return true;
            }
        }
        return false;
    }

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    /**
     * Handle filters reset
     */
    const handleFilterReset = () => {
        setFilters({
            status: possibleStatus,
            stageName: stagesName,
            companyName: companiesName,
            postingDate: possibleDates[0],
        })
    }

    const handleDateSelect = (selectedDate) => {
        let index = date.findIndex(i => i === selectedDate)
        if(index > -1){
            handleDateChange(possibleDates[index])
        }
    };

    /**
     * Handle date change
     * @param {string} newValue
     */
    const handleDateChange = (newValue) => {
        let allFilters = {...filters}
        allFilters.postingDate = newValue
        setFilters(allFilters);
    };

    /**
     * Handle status type change
     * @param {string} newValue
     */
    const handleStatusTypeChange = (newValue) => {
        let allFilters = {...filters}
        let filterStatus = [...allFilters.status]
        let index = filterStatus.findIndex(ct => ct === newValue)
        if(index === -1){
            // A status filter is added
            filterStatus.push(newValue)
        }
        else{
            // A status filter is deleted
            filterStatus.splice(index, 1);
        }
        allFilters.status = filterStatus
        setFilters(allFilters);
    };

    /**
     * Handle stage change
     * @param {string} newValue
     */
    const handleStageChange = (newValue) => {
        let allFilters = {...filters}
        let filter = [...allFilters.stageName]
        let index = filter.findIndex(ct => ct === newValue)
        if(index === -1){
            filter.push(newValue)
        }
        else{
            filter.splice(index, 1);
        }
        allFilters.stageName = filter
        setFilters(allFilters);
    };

    /**
     * Handle search term change
     * @param {string} newValue
     */
    const handleSearchChange = (newValue) => {
        setSearchTerm(newValue.toLowerCase())
    }

    /**
     * Choose how to sort the jobs by date
     */
    const toggleSort = () => {
        let newOrder = orderByPostDate === 1 ? 0 : 1
        setOrderByPostDate(newOrder)
    }

    /**
     * Changes the page and calculates jobs for the current page
     * @param filteredAppsList
     * @param pageNumber
     */
    const paginate = (filteredAppsList, pageNumber) => {
        const indexOfLastApp = pageNumber * appsPerPage;
        const indexOfFirstApp = indexOfLastApp - appsPerPage;
        const appsForPage = filteredAppsList.slice(indexOfFirstApp, indexOfLastApp);
        setPaginatingApp(appsForPage);
        setCurrentPage(pageNumber);
    };

    /**
     * Renders date item
     * @param {string} date
     * @param {any} handleClick
     * @param {any} modifiers
     * @param {any} _query
     * @returns {any}
     */
    const renderDateType = (date, {handleClick, modifiers, _query}) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem active={modifiers.active}
                      disabled={modifiers.disabled}
                      text={date}
                      key={date}
                      onClick={handleClick}
                      shouldDismissPopover={true}
            />
        );
    };

    const stopRecruitmentProcess = () =>{
        if(employer && employer.employerId !== ""){
            stopRecruitmentProcessEmp()
        }
        else{
            stopRecruitmentProcessCan()
        }
    }


    const stopRecruitmentProcessEmp = () =>{
        if(reason.length > 0){
            setReasonValid(true)
            let request = {
                jobId: currentApp.job.jobId,
                candidateId: currentApp.candidateId,
                reason: reason,
            }
            AppService.refuseApplicationEmployer(request).then((response) => {
                AppToaster.show({
                    message: t('apps_stop_success'),
                    intent: Intent.SUCCESS,
                });
                setIsDrawerOpen(false)
                setIsStopDialogOpen(false)
                setReason("")
                getAllApplicationsForJob()
            }).catch(error => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('apps_stop_err'),
                    intent: Intent.DANGER,
                });
            });
        }
        else{
            setReasonValid(false)
        }
    }

    const stopRecruitmentProcessCan = () =>{
            if(reason.length > 0){
                setReasonValid(true)
                let request = {
                    jobId: currentApp.job.jobId,
                    candidateId: candidate.candidateId,
                    reason: reason,
                }
                AppService.refuseApplicationCandidate(request).then((response) => {
                    AppToaster.show({
                        message: t('apps_stop_success'),
                        intent: Intent.SUCCESS,
                    });
                    setIsDrawerOpen(false)
                    setIsStopDialogOpen(false)
                    setReason("")
                    getAllApplicationsForCandidate()
                }).catch(error => {
                    console.error('Error: ', error.message);
                    AppToaster.show({
                        message: t('apps_stop_err'),
                        intent: Intent.DANGER,
                    });
                });
            }
            else {
                setReasonValid(false)
            }
    }

    const renderStopProcessDialog = () => {
        return <Dialog
            isOpen={isStopDialogOpen}
            onClose={() => {
                setIsStopDialogOpen(false)
                setReason("")
            }
            }
            title={t('stop_process')}
            canOutsideClickClose={false}
            className="stop-process-dialog"
        >
            <DialogBody useOverflowScrollContainer={false}>
                <p>{t('message_recruit_delete')}</p>
                <FormGroup
                    intent={!reasonValid ? Intent.DANGER : Intent.NONE}
                    helperText={!reasonValid ? t('reason_in') : ""}
                >
                    <TextArea name="description"
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              rows={3}
                              style={{width: "100%", resize: "none"}}/>
                </FormGroup>
                <DialogFooter minimal={true} actions={<div>
                    <Button intent="danger" onClick={stopRecruitmentProcess}>{t('stop_process')}</Button>
                    <Button onClick={() => {
                        setIsStopDialogOpen(false)
                        setReason("")
                    }}>{t('cancel')}</Button>
                </div>}/>
            </DialogBody>
        </Dialog>
    }

    const goToNextStep = () =>{
        let request={
            jobId: currentApp.job.jobId,
            candidateId: currentApp.candidateId,
        }
        AppService.setNextStage(request).then((response) => {
            AppToaster.show({
                message: t('apps_next_success'),
                intent: Intent.SUCCESS,
            });
            setIsDrawerOpen(false)
            setIsStopDialogOpen(false)
            setReason("")
            getAllApplicationsForJob()
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('apps_next_err'),
                intent: Intent.DANGER,
            });
        });
    }

    const goToSecondStep = (app) =>{
        let request={
            jobId: app.job.jobId,
            candidateId: app.candidateId,
        }
        AppService.setNextStage(request).then((response) => {
            setCurrentApp(response.data)
            getAllApplicationsForJob()
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('apps_next_err'),
                intent: Intent.DANGER,
            });
        });
    }

    /**
     * Methods used for viewing a job
     */
    const viewJob = (job) => {
        dispatch(setJobData(job));
        navigate("/viewJob")
    }

    const renderTemplateCvDrawerCandidate = () => {
        let currentStageNr = currentApp.stageNr
        let cvShortName = currentApp.cvName.split("_").slice(1).join("_")
        return <Drawer
            isOpen={isDrawerOpen}
            onClose={() => {
                setCurrentApp(null)
                toggleDrawer()
            }}
            title={t('view_details_about') + " " + currentApp.job.title}
            size={isSmallScreen ? "90%" : "50%"}
            position="left"
            className="app-form-drawer-container"
            canOutsideClickClose={false}
        >
            <div className="see-more-app">
                <Card className="see-more-app-card">
                    <H5>{t('status_section')}</H5>
                    <div className="see-more-app-status">
                        <p>{// Refused
                            currentApp.status === possibleStatus[0] ? t('status_refused_can') : ""
                        }</p>
                        <p>{// Refused reason
                            currentApp.status === possibleStatus[0] ? '"' + currentApp.refusalReason + '"' : ""
                        }</p>
                        <p>{// In progress
                            currentApp.status === possibleStatus[1] ? t('status_progress_can') : ""
                        }</p>
                        <p>{// Finished
                            currentApp.status === possibleStatus[2] ? t('status_finished_can') : ""
                        }</p>
                    </div>
                </Card>
                <Card className="see-more-app-card">
                    <H5>{t('cv_section')}</H5>
                    <p className="see-more-app-cv">
                        {t('cv_app_first_can')} <span className="see-app-cv">{cvShortName}</span>. {t('cv_app_second_can')}
                    </p>
                    <Button
                        onClick={() => {
                            handleOpenCV({
                                cvName: cvShortName,
                                cvId: currentApp.cvId,
                                cvNameComplete: currentApp.cvName
                            })
                        }}
                        small
                    >{t('view_cv')}</Button>
                </Card>
                <Card className="see-more-app-card">
                    <H5>{t('stage_section')}</H5>
                    {currentApp.allStages.map((stageValue, index) => (
                        <div key={index} className="stage-item-general">
                            <div
                                className={currentStageNr > index ? "passed-staged" : currentStageNr === index ? "current-stage" : "next-stage"}>
                                {t('stage_nr') + " " + (index + 1)}. {stageValue.stageName}
                            </div>
                        </div>
                    ))}
                </Card>
            </div>
            <div className={Classes.DRAWER_FOOTER + " cv-drawer"}>
                {currentApp.status === possibleStatus[1] && <Button
                    onClick={() => setIsStopDialogOpen(true)}
                    intent={Intent.DANGER}
                    icon="stopwatch"
                >
                    {t('stop_process')}
                </Button>}
            </div>
            {renderStopProcessDialog()}
        </Drawer>
    }

    const renderTemplateCvDrawerEmployer = () => {
        let currentStageNr = currentApp.stageNr
        let cvShortName = currentApp.cvName.split("_").slice(1).join("_")
        return <Drawer
            isOpen={isDrawerOpen}
            onClose={() => {
                setCurrentApp(null)
                toggleDrawer()
            }}
            title={t('view_details_about') + " " + currentApp.candidateFirstname + " " + currentApp.candidateLastname}
            size={isSmallScreen ? "90%" : "50%"}
            position="left"
            className="app-form-drawer-container"
            canOutsideClickClose={false}
        >
            <div className="see-more-app">
                <Card className="see-more-app-card">
                    <H5>{t('status_section')}</H5>
                    <div className="see-more-app-status">
                        <p>{// Refused
                            currentApp.status === possibleStatus[0] ? t('status_refused_emp') : ""
                        }</p>
                        <p>{// Refused reason
                            currentApp.status === possibleStatus[0] ? '"' + currentApp.refusalReason + '"' : ""
                        }</p>
                        <p>{// In progress
                            currentApp.status === possibleStatus[1] ? t('status_progress_emp') : ""
                        }</p>
                        <p>{// Finished
                            currentApp.status === possibleStatus[2] ? t('status_finished_emp') : ""
                        }</p>
                    </div>
                </Card>
                <Card className="see-more-app-card">
                    <H5>{t('cv_section')}</H5>
                    <p className="see-more-app-cv">
                        {t('cv_app_first_emp')} <span className="see-app-cv">{cvShortName}</span>. {t('cv_app_second_emp')}
                    </p>
                    <Button
                        onClick={() => {
                            handleOpenCV({
                                cvName: cvShortName,
                                cvId: currentApp.cvId,
                                cvNameComplete: currentApp.cvName
                            })
                        }}
                        small
                    >{t('view_cv')}</Button>
                </Card>
                <Card className="see-more-app-card">
                    <H5>{t('stage_section')}</H5>
                    {currentApp.allStages.map((stageValue, index) => (
                        <div key={index} className="stage-item-general">
                            <div
                                className={currentStageNr > index ? "passed-staged" : currentStageNr === index ? "current-stage" : "next-stage"}>
                                {t('stage_nr') + " " + (index + 1)}. {stageValue.stageName}
                            </div>
                        </div>
                    ))}
                </Card>
                {currentApp.allAnswers.length> 0 &&<Card className="see-more-app-card">
                    <H5>{t('answers_section')}</H5>
                    {currentApp.allAnswers.map((answer, index) => (
                        <div key={index} className="question-item-general">
                            <div className="app-item-question">
                                {t('the_question') + " " + (index + 1)}. {answer.questionText}
                            </div>
                            <div className="app-item-answer">
                                {t('answer_nr') + " " + (index + 1)}: {answer.answer}
                            </div>
                            <Divider/>
                        </div>
                    ))}
                </Card>
                }
            </div>
            <div className={Classes.DRAWER_FOOTER + " app-drawer"}>
                {currentApp.status === possibleStatus[1] && <Button
                    onClick={() => goToNextStep()}
                    intent={Intent.SUCCESS}
                    icon="step-forward"
                >
                    {t('next_step_app')}
                </Button>}
                {currentApp.status === possibleStatus[1] && <Button
                    onClick={() => setIsStopDialogOpen(true)}
                    intent={Intent.DANGER}
                    icon="stopwatch"
                >
                    {t('stop_process')}
                </Button>}
            </div>
            {renderStopProcessDialog()}
        </Drawer>
    }

    /**
     * Handle company change
     * @param {string} newValue
     */
    const handleCompanyChange = (newValue) => {
        let allFilters = {...filters}
        let filter = [...allFilters.companyName]
        let index = filter.findIndex(ct => ct === newValue)
        if(index === -1){
            filter.push(newValue)
        }
        else{
            filter.splice(index, 1);
        }
        allFilters.companyName = filter
        setFilters(allFilters);
    };



    const totalPages = Math.ceil(filteredApps.length / appsPerPage);

    return (
        <div>
            {candidate && candidate.candidateId !== "" ? <HeaderPageCandidate/> : <HeaderPageEmployer/>}
            <div className={"jobs-component"}>
                <div className="filter-section filter-section-app">
                    <div className="filter-section-header">
                        <div className="filter-section-title">{t('filters_caps')}</div>
                        <Tooltip content={t('reset_filters')} position="bottom">
                            <Button
                                className="reset-filter-button"
                                onClick={handleFilterReset}
                                small={true}
                                minimal={true}
                                icon={"reset"}
                            >
                            </Button>
                        </Tooltip>
                    </div>
                    <FormGroup label={t('app_date')} className={`jobs-contractType-filter ${Classes.FIXED}`}>
                        <Select items={date}
                                fill={true}
                                matchTargetWidth={true}
                                filterable={false}
                                itemRenderer={renderDateType}
                                onItemSelect={(e) => handleDateSelect(e)}
                                popoverProps={{position: Position.BOTTOM}}
                        >
                            <Button text={date[possibleDates.findIndex(d => d === filters.postingDate)]}
                                    rightIcon="double-caret-vertical"
                                    fill={true}/>
                        </Select>
                    </FormGroup>
                    <FormGroup label={t('status')} className={`jobs-contractType-filter ${Classes.FIXED}`}>
                        <div className="job-checkbox-container">
                            {status.map((s, index) =>
                                <Checkbox
                                    className="job-checkbox-item"
                                    label={s}
                                    checked={filters.status.includes(possibleStatus[index])}
                                    onChange={() => handleStatusTypeChange(possibleStatus[index])}
                                />
                            )}
                        </div>
                    </FormGroup>
                    <FormGroup label={t('stage')} className={`jobs-contractType-filter ${Classes.FIXED}`}>
                        {employer && employer.employerId !== "" && stagesName.length > 0 ?
                            <div className="job-checkbox-container job-checkbox-container-app">
                                {stagesName.map((obj, index) =>
                                    <Checkbox
                                        className="job-checkbox-item"
                                        label={obj}
                                        checked={filters.stageName.includes(stagesName[index])}
                                        onChange={() => handleStageChange(stagesName[index])}
                                    />
                                )}
                            </div> :
                            employer && employer.employerId !== "" && <div className="no-job-filter">{t('no_app_stage')}</div>
                        }
                        {candidate && candidate.candidateId !== "" && companiesName.length > 0 ?
                            <div className="job-checkbox-container companiesName">
                                {companiesName.map((obj, index) =>
                                    <Checkbox
                                        className="job-checkbox-item"
                                        label={obj}
                                        checked={filters.companyName.includes(companiesName[index])}
                                        onChange={() => handleCompanyChange(companiesName[index])}
                                    />
                                )}
                            </div> :
                            candidate && candidate.candidateId !== "" && <div className="no-job-filter">{t('no_app_company')}</div>
                        }
                    </FormGroup>
                </div>
                <div className={"right-section"}>
                    <div className={"job-page-buttons"}>
                        <div className="job-page-second-line-buttons">
                            <InputGroup
                                disabled={false}
                                placeholder={candidate && candidate.candidateId !== ""  ? t('search_by_candidate') : t('search_by_job')}
                                type="search"
                                onChange={(e)=> handleSearchChange(e.target.value)}
                            />
                            <Tooltip className="sort-jobs-tooltip" content={orderByPostDate === 0 ? t('sort_app_asc') : t('sort_apps_desc')} position="bottom-left">
                                <Button
                                    className="sort-jobs-button"
                                    onClick={toggleSort}
                                    small
                                    minimal
                                    rightIcon={orderByPostDate === 0 ? <Icon size={14} icon="sort-asc" color="black"/> : <Icon size={14} icon="sort-desc" color="black"/>}
                                >
                                    {t('sort_by_post_date')}
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                    <div className={paginatingApps.length > 0 ? "jobs-list" : "jobs-non-ideal"}>
                        {paginatingApps.length > 0 ? (
                            <div className="jobs-list-show">
                                <div className="just-jobs">
                                    {paginatingApps.map((app, index) => (
                                        <div className="job-item" key={index}>
                                            <div className="job-details">
                                                <div className="jobs-detail-text jobs-detail-text-app">
                                                    <div className="jobs-detail">
                                                        <div
                                                            className="job-text-date">{formatDate(app.appDate)}</div>
                                                    </div>
                                                    {employer && employer.employerId !== "" && <div className="jobs-detail">
                                                        <div className="job-text-title"
                                                        >{app.candidateFirstname} {app.candidateLastname}</div>
                                                    </div>}
                                                    {candidate && candidate.candidateId !== "" && <div className="jobs-detail">
                                                        <div
                                                            className="job-text-company">{t('company_name')}: {app.employerCompanyName}</div>
                                                    </div>}
                                                    <div className="jobs-detail">
                                                        <div
                                                            className="job-text-company">{t('job_name')}: {app.job.title}</div>
                                                    </div>
                                                    <div className="jobs-detail">
                                                        <div
                                                            className="job-text-company">{t('status')}: {status[possibleStatus.findIndex(i => i === app.status)]}</div>
                                                    </div>
                                                    <div className="jobs-detail">
                                                        <div
                                                            className="job-text-company">{t('current_stage')}: {app.stageName}</div>
                                                    </div>
                                                </div>
                                                <Button
                                                    className="show-job-button"
                                                    onClick={() => {
                                                        setCurrentApp(app)
                                                        toggleDrawer()
                                                            if(app.stageNr === 0 && app.status === possibleStatus[1] && employer && employer.employerId !== "") {
                                                                goToSecondStep(app)
                                                            }
                                                        }}
                                                        small
                                                        minimal
                                                        rightIcon={<Icon size={13} icon="layout-sorted-clusters" color="black"/>}
                                                    >
                                                        {t('see_more')}
                                                    </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    {totalPages > 1 && (
                                        <div className="pagination-container">
                                            {Array.from({length: totalPages}, (_, i) => (
                                                <button
                                                    key={i + 1}
                                                    onClick={() => paginate(filteredApps, i + 1)}
                                                    disabled={currentPage === i + 1}
                                                    className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <NonIdealState
                                icon={<img src={SearchIcon} alt="Search icon"/>}
                                title={t('no_apps_found')}
                                description={candidate && candidate.candidateId !== ""  ? t('no_apps_explanation_can') : t('no_apps_explanation_emp')}
                            />
                        )}
                    </div>
                    {employer && employer.employerId !== "" && currentApp && renderTemplateCvDrawerEmployer()}
                    {candidate && candidate.candidateId !== "" && currentApp && renderTemplateCvDrawerCandidate()}
                </div>
            </div>
        </div>
    );
};

export default ApplicationPage;
