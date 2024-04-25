import React, { useEffect, useState } from "react";
import "./ApplicationPage.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppToaster } from "../common/AppToaster";
import {
  Button,
  Card,
  Checkbox,
  Classes,
  Dialog,
  DialogBody,
  DialogFooter,
  Divider,
  Drawer,
  FormGroup,
  H5,
  Icon,
  InputGroup,
  Intent,
  MenuItem,
  NonIdealState,
  Position,
  Tag,
  TextArea,
  Tooltip,
} from "@blueprintjs/core";
import AppService from "../../services/app.service";
import { Select } from "@blueprintjs/select";
import SearchIcon from "../../resources-photo/svg/no_job.svg";
import JobService from "../../services/job.service";
import { dateEn, dateRo, possibleDates } from "../job/JobsPage";
import HeaderPageCandidate from "../header/HeaderPageCandidate";
import HeaderPageEmployer from "../header/HeaderPageEmployer";
import {
  formatDate,
  handleOpenCV,
  useMediaQuery,
} from "../common/CommonMethods";
import { useNavigate } from "react-router-dom";
import { setJobData } from "../../redux/actions/jobActions";
import ComplaintDialog from "../common/ComplaintDialog";
import ReactPaginate from "react-paginate";

export const possibleStatus = ["refuzat", "in_curs", "finalizat"];
export const statusEn = ["Refused", "In Progress", "Completed"];
export const statusRo = ["Refuzat", "În curs", "Finalizat"];

const ApplicationPage = () => {
  const { t, i18n } = useTranslation();
  const employer = useSelector((state) => state.auth.employer);
  const candidate = useSelector((state) => state.auth.candidate);
  const openedJob = useSelector((state) => state.job.jobDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const status = i18n.language === "ro" ? statusRo : statusEn;
  const date = i18n.language === "ro" ? dateRo : dateEn;

  const [apps, setApps] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderByPostDate, setOrderByPostDate] = useState(0);
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

  const [stagesName, setStagesName] = useState([]);
  const [stagesRo, setStagesRo] = useState([]);
  const [stagesEng, setStagesEng] = useState([]);

  const [companiesName, setCompaniesName] = useState([]);

  // Paginating
  const [currentPage, setCurrentPage] = useState(0);
  const appsPerPage = 15; // Number of apps per page
  const [paginatingApps, setPaginatingApp] = useState([]);
  const isSmallScreen = useMediaQuery("(max-width: 900px)");
  const [expandedCards, setExpandedCards] = useState([]);

  const [complaintDialogOpen, setComplaintDialogOpen] = useState(false);
  const [complainedUserEmail, setComplainedUserEmail] = useState("");
  const [complainantUserEmail, setComplainantUserEmail] = useState("");

  useEffect(() => {
    if (candidate && candidate.candidateId !== "") {
      getAllApplicationsForCandidate();
    } else {
      if (employer && employer.employerId !== "") {
        getAllApplicationsForJob();
      }
    }
  }, []);

  const getAllApplicationsForJob = () => {
    AppService.getAllApplicationsForJob(openedJob.jobId)
      .then((response) => {
        let appResponse = response.data;
        getAllStagesForJob();
        setApps(appResponse);
        setFilteredApps(appResponse);
      })
      .catch((error) => {
        console.error("Error: ", error.message);
        AppToaster.show({
          message: t("apps_retrieval_err"),
          intent: Intent.DANGER,
        });
      });
  };

  const getAllApplicationsForCandidate = () => {
    AppService.getAllApplicationsForCandidate(candidate.candidateId)
      .then((response) => {
        let appResponse = response.data;
        let companyResponse = [
          ...new Set(appResponse.map((j) => j.employerCompanyName)),
        ];
        setCompaniesName(companyResponse);
        setApps(response.data);
        let filtersApps = { ...filters };
        filtersApps.companyName = companyResponse;
        setFilters(filtersApps);
        setFilteredApps(appResponse);
      })
      .catch((error) => {
        console.error("Error: ", error.message);
        AppToaster.show({
          message: t("apps_retrieval_err"),
          intent: Intent.DANGER,
        });
      });
  };

  const getAllStagesForJob = () => {
    JobService.getStagesForJob(openedJob.jobId)
      .then((response) => {
        let stageResponse = [...new Set(response.data.map((j) => j.stageName))];
        setStagesName(stageResponse);
        let filtersApps = { ...filters };
        filtersApps.stageName = stageResponse;
        setFilters(filtersApps);
        let stagesInRomanian = [];
        let stagesInEnglish = [];
        stageResponse.forEach((stage) => {
          let parts = stage.split(" (");
          if (parts.length > 1) {
            let englishPart = parts[0];
            let romanianPart = parts[1].substring(0, parts[1].length - 1);
            stagesInRomanian.push(romanianPart);
            stagesInEnglish.push(englishPart);
          } else {
            let englishPart = parts[0];
            let romanianPart = parts[0];
            stagesInRomanian.push(romanianPart);
            stagesInEnglish.push(englishPart);
          }
        });
        setStagesRo(stagesInRomanian);
        setStagesEng(stagesInEnglish);
      })
      .catch((error) => {
        console.error("Error: ", error.message);
        AppToaster.show({
          message: t("apps_retrieval_err"),
          intent: Intent.DANGER,
        });
      });
  };

  /**
   * Method that handle the filtering
   */
  useEffect(() => {
    if (employer && employer.employerId !== "") {
      filterForEmp();
    } else {
      filterForCan();
    }
  }, [apps, filters, searchTerm, orderByPostDate]);

  const filterForCan = () => {
    setCurrentPage(0);
    // Filter by contract type
    let allApps = [...apps];
    let filtered = allApps.filter(
      (app) =>
        app.job.title.toLowerCase().includes(searchTerm) &&
        filters.status.includes(app.status) &&
        filters.companyName.includes(app.employerCompanyName) &&
        filterByDate(filters.postingDate, app.appDate),
    );
    if (orderByPostDate === 1) {
      filtered.sort((a, b) => new Date(a.appDate) - new Date(b.appDate));
    } else {
      filtered.sort((a, b) => new Date(b.appDate) - new Date(a.appDate));
    }
    setFilteredApps(filtered);
    paginate(filtered, 0);
  };

  const filterForEmp = () => {
    setCurrentPage(0);
    // Filter by contract type
    let allApps = [...apps];
    let filtered = allApps.filter(
      (app) =>
        (app.candidateLastname.toLowerCase().includes(searchTerm) ||
          app.candidateFirstname.toLowerCase().includes(searchTerm)) &&
        filters.status.includes(app.status) &&
        filters.stageName.includes(app.stageName) &&
        filterByDate(filters.postingDate, app.appDate),
    );
    if (orderByPostDate === 1) {
      filtered.sort((a, b) => new Date(a.appDate) - new Date(b.appDate));
    } else {
      filtered.sort((a, b) => new Date(b.appDate) - new Date(a.appDate));
    }
    setFilteredApps(filtered);
    paginate(filtered, 0);
  };

  /**
   * Return true if the job is posted in the selected time, false otherwise
   * @param {string} filtersDate
   * @param {string} date
   */
  const filterByDate = (filtersDate, date) => {
    // Anytime
    if (filtersDate === possibleDates[0]) {
      return true;
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
  };

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
    });
  };

  const handleDateSelect = (selectedDate) => {
    let index = date.findIndex((i) => i === selectedDate);
    if (index > -1) {
      handleDateChange(possibleDates[index]);
    }
  };

  /**
   * Handle date change
   * @param {string} newValue
   */
  const handleDateChange = (newValue) => {
    let allFilters = { ...filters };
    allFilters.postingDate = newValue;
    setFilters(allFilters);
  };

  /**
   * Handle status type change
   * @param {string} newValue
   */
  const handleStatusTypeChange = (newValue) => {
    let allFilters = { ...filters };
    let filterStatus = [...allFilters.status];
    let index = filterStatus.findIndex((ct) => ct === newValue);
    if (index === -1) {
      // A status filter is added
      filterStatus.push(newValue);
    } else {
      // A status filter is deleted
      filterStatus.splice(index, 1);
    }
    allFilters.status = filterStatus;
    setFilters(allFilters);
  };

  /**
   * Handle stage change
   * @param {string} newValue
   */
  const handleStageChange = (newValue) => {
    let allFilters = { ...filters };
    let filter = [...allFilters.stageName];
    let index = filter.findIndex((ct) => ct === newValue);
    if (index === -1) {
      filter.push(newValue);
    } else {
      filter.splice(index, 1);
    }
    allFilters.stageName = filter;
    setFilters(allFilters);
  };

  /**
   * Handle search term change
   * @param {string} newValue
   */
  const handleSearchChange = (newValue) => {
    setSearchTerm(newValue.toLowerCase());
  };

  /**
   * Choose how to sort the jobs by date
   */
  const toggleSort = () => {
    let newOrder = orderByPostDate === 1 ? 0 : 1;
    setOrderByPostDate(newOrder);
  };

  /**
   * Changes the page and calculates jobs for the current page
   * @param filteredAppsList
   * @param pageNumber
   */
  const paginate = (filteredAppsList, pageNumber) => {
    const indexOfLastApp = (pageNumber + 1) * appsPerPage;
    const indexOfFirstApp = pageNumber * appsPerPage;
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
  const renderDateType = (date, { handleClick, modifiers, _query }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={modifiers.active}
        disabled={modifiers.disabled}
        text={date}
        key={date}
        onClick={handleClick}
        shouldDismissPopover={true}
      />
    );
  };

  const stopRecruitmentProcess = () => {
    if (employer && employer.employerId !== "") {
      stopRecruitmentProcessEmp();
    } else {
      stopRecruitmentProcessCan();
    }
  };

  const stopRecruitmentProcessEmp = () => {
    if (reason.length > 0) {
      setReasonValid(true);
      let request = {
        jobId: currentApp.job.jobId,
        candidateId: currentApp.candidateId,
        reason: reason,
      };
      AppService.refuseApplicationEmployer(request)
        .then((response) => {
          AppToaster.show({
            message: t("apps_stop_success"),
            intent: Intent.SUCCESS,
          });
          setIsDrawerOpen(false);
          setIsStopDialogOpen(false);
          setReason("");
          getAllApplicationsForJob();
        })
        .catch((error) => {
          console.error("Error: ", error.message);
          AppToaster.show({
            message: t("apps_stop_err"),
            intent: Intent.DANGER,
          });
        });
    } else {
      setReasonValid(false);
    }
  };

  const stopRecruitmentProcessCan = () => {
    if (reason.length > 0) {
      setReasonValid(true);
      let request = {
        jobId: currentApp.job.jobId,
        candidateId: candidate.candidateId,
        reason: reason,
      };
      AppService.refuseApplicationCandidate(request)
        .then((response) => {
          AppToaster.show({
            message: t("apps_stop_success"),
            intent: Intent.SUCCESS,
          });
          setIsDrawerOpen(false);
          setIsStopDialogOpen(false);
          setReason("");
          getAllApplicationsForCandidate();
        })
        .catch((error) => {
          console.error("Error: ", error.message);
          AppToaster.show({
            message: t("apps_stop_err"),
            intent: Intent.DANGER,
          });
        });
    } else {
      setReasonValid(false);
    }
  };

  const renderStopProcessDialog = () => {
    return (
      <Dialog
        isOpen={isStopDialogOpen}
        onClose={() => {
          setIsStopDialogOpen(false);
          setReason("");
        }}
        title={t("stop_process")}
        canOutsideClickClose={false}
        className="stop-process-dialog"
      >
        <DialogBody useOverflowScrollContainer={false}>
          <p>{t("message_recruit_delete")}</p>
          <FormGroup
            intent={!reasonValid ? Intent.DANGER : Intent.NONE}
            helperText={!reasonValid ? t("reason_in") : ""}
          >
            <TextArea
              name="description"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              style={{ width: "100%", resize: "none" }}
            />
          </FormGroup>
          <DialogFooter
            minimal={true}
            actions={
              <div>
                <Button
                  intent="danger"
                  className={"user-button-for-outline"}
                  onClick={stopRecruitmentProcess}
                >
                  {t("stop_process")}
                </Button>
                <Button
                  className={"user-button-for-outline"}
                  onClick={() => {
                    setIsStopDialogOpen(false);
                    setReason("");
                  }}
                >
                  {t("cancel")}
                </Button>
              </div>
            }
          />
        </DialogBody>
      </Dialog>
    );
  };

  const goToNextStep = () => {
    let request = {
      jobId: currentApp.job.jobId,
      candidateId: currentApp.candidateId,
    };
    AppService.setNextStage(request)
      .then((response) => {
        AppToaster.show({
          message: t("apps_next_success"),
          intent: Intent.SUCCESS,
        });
        setIsDrawerOpen(false);
        setIsStopDialogOpen(false);
        setReason("");
        getAllApplicationsForJob();
      })
      .catch((error) => {
        console.error("Error: ", error.message);
        AppToaster.show({
          message: t("apps_next_err"),
          intent: Intent.DANGER,
        });
      });
  };

  const goToSecondStep = (app) => {
    let request = {
      jobId: app.job.jobId,
      candidateId: app.candidateId,
    };
    AppService.setNextStage(request)
      .then((response) => {
        setCurrentApp(response.data);
        getAllApplicationsForJob();
      })
      .catch((error) => {
        console.error("Error: ", error.message);
        AppToaster.show({
          message: t("apps_next_err"),
          intent: Intent.DANGER,
        });
      });
  };

  /**
   * Methods used for viewing a job
   */
  const viewJob = (job) => {
    dispatch(setJobData(job));
    navigate("/viewJob");
  };

  const openComplainDialog = (email) => {
    setComplaintDialogOpen(true);
    setComplainedUserEmail(email);
    if (candidate && candidate.candidateId !== "") {
      setComplainantUserEmail(candidate.userDetails.email);
    } else if (employer && employer.employerId !== "") {
      setComplainantUserEmail(employer.userDetails.email);
    }
  };

  const closeComplainDialog = (email) => {
    setComplaintDialogOpen(false);
    setComplainedUserEmail("");
    setComplainantUserEmail("");
  };

  const renderTemplateCvDrawerCandidate = () => {
    let currentStageNr = currentApp.stageNr;
    let copy = [...currentApp.allStages];
    let cvShortName = currentApp.cvName.split("_").slice(1).join("_");
    let currentStagesForCandidate = copy.map((stage) => {
      if (stage.stageName.includes("(")) {
        let parts = stage.stageName.split(" (");
        let englishPart = parts[0];
        let romanianPart = parts[1].substring(0, parts[1].length - 1);
        if (i18n.language === "ro") {
          stage.stageName = romanianPart;
        } else {
          stage.stageName = englishPart;
        }
      }
      return stage;
    });
    return (
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setCurrentApp(null);
          toggleDrawer();
        }}
        title={t("view_details_about") + " " + currentApp.job.title}
        size={isSmallScreen ? "90%" : "50%"}
        position="left"
        className="app-form-drawer-container"
        canOutsideClickClose={false}
      >
        <div className="see-more-app">
          <Card className="see-more-app-card">
            <div className="half-circle"></div>
            <div className="app-card-header">
              <H5 className="app-card-title">{t("status_section")}</H5>
            </div>
            <div className="app-card-body">
              <div className="see-more-app-status">
                <p>
                  {
                    // Refused
                    currentApp.status === possibleStatus[0]
                      ? t("status_refused_can")
                      : ""
                  }
                </p>
                <p>
                  {
                    // Refused reason
                    currentApp.status === possibleStatus[0]
                      ? '"' + currentApp.refusalReason + '"'
                      : ""
                  }
                </p>
                <p>
                  {
                    // In progress
                    currentApp.status === possibleStatus[1]
                      ? t("status_progress_can")
                      : ""
                  }
                </p>
                <p>
                  {
                    // Finished
                    currentApp.status === possibleStatus[2]
                      ? t("status_finished_can")
                      : ""
                  }
                </p>
              </div>
            </div>
            <div className="app-card-footer">
              {currentApp.status === possibleStatus[1] && (
                <Button
                  onClick={() => setIsStopDialogOpen(true)}
                  intent={Intent.WARNING}
                  className="app-stop-process-button  user-button-for-outline"
                >
                  {t("stop_process")}
                </Button>
              )}
            </div>
          </Card>
          <Card className="see-more-app-card">
            <div className="half-circle"></div>
            <div className="app-card-header">
              <H5 className="app-card-title">{t("cv_section")}</H5>
            </div>
            <div className="app-card-body">
              <p className="see-more-app-cv">
                {t("cv_app_first_can")}{" "}
                <span className="see-app-cv">{cvShortName}</span>.{" "}
                {t("cv_app_second_can")}
              </p>
            </div>
            <div className="app-card-footer">
              <Button
                onClick={() => {
                  handleOpenCV({
                    cvName: cvShortName,
                    cvId: currentApp.cvId,
                    cvNameComplete: currentApp.cvName,
                  });
                }}
                small
                className={"app-view-cv-button user-button-for-outline"}
              >
                {t("view_cv")}
              </Button>
            </div>
          </Card>
          <Card className="see-more-app-card">
            <div className="half-circle"></div>
            <div className="app-card-header">
              <H5 className="app-card-title">{t("stage_section")}</H5>
            </div>
            <div className="app-card-body">
              {currentStagesForCandidate.map((stageValue, index) => (
                <div key={index} className="stage-item-general">
                  <div
                    className={
                      currentStageNr > index
                        ? "passed-staged"
                        : currentStageNr === index
                          ? "current-stage"
                          : "next-stage"
                    }
                  >
                    {t("stage_nr") + " " + (index + 1)}. {stageValue.stageName}{" "}
                    {currentStageNr === index && (
                      <Tag key={"current-stage"} intent={Intent.PRIMARY}>
                        {t("current_stage")}
                      </Tag>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className={Classes.DRAWER_FOOTER + " app-drawer"}>
          <Button
            onClick={() => openComplainDialog(currentApp?.employerEmail)}
            intent={Intent.DANGER}
            icon="issue"
            className="app-report-button user-button-for-outline"
          >
            {t("report")}
          </Button>
        </div>
        <ComplaintDialog
          isOpen={complaintDialogOpen}
          onClose={closeComplainDialog}
          complainedUser={complainedUserEmail}
          complainantUser={complainantUserEmail}
        ></ComplaintDialog>
        {renderStopProcessDialog()}
      </Drawer>
    );
  };

  const renderTemplateCvDrawerEmployer = () => {
    let currentStageNr = currentApp.stageNr;
    let cvShortName = currentApp.cvName.split("_").slice(1).join("_");
    let copy = [...currentApp.allStages];
    let currentStagesForEmployer = copy.map((stage) => {
      if (stage.stageName.includes("(")) {
        let parts = stage.stageName.split(" (");
        let englishPart = parts[0];
        let romanianPart = parts[1].substring(0, parts[1].length - 1);
        if (i18n.language === "ro") {
          stage.stageName = romanianPart;
        } else {
          stage.stageName = englishPart;
        }
      }
      return stage;
    });
    return (
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setCurrentApp(null);
          toggleDrawer();
        }}
        title={
          t("view_details_about") +
          " " +
          currentApp.candidateFirstname +
          " " +
          currentApp.candidateLastname
        }
        size={isSmallScreen ? "90%" : "50%"}
        position="left"
        className="app-form-drawer-container"
        canOutsideClickClose={false}
      >
        <div className="see-more-app">
          <Card className="see-more-app-card">
            <div className="half-circle"></div>
            <div className="app-card-header">
              <H5 className="app-card-title">{t("status_section")}</H5>
            </div>
            <div className="app-card-body">
              <div className="see-more-app-status">
                <p>
                  {
                    // Refused
                    currentApp.status === possibleStatus[0]
                      ? t("status_refused_emp")
                      : ""
                  }
                </p>
                <p>
                  {
                    // Refused reason
                    currentApp.status === possibleStatus[0]
                      ? '"' + currentApp.refusalReason + '"'
                      : ""
                  }
                </p>
                <p>
                  {
                    // In progress
                    currentApp.status === possibleStatus[1]
                      ? t("status_progress_emp")
                      : ""
                  }
                </p>
                <p>
                  {
                    // Finished
                    currentApp.status === possibleStatus[2]
                      ? t("status_finished_emp")
                      : ""
                  }
                </p>
              </div>
            </div>
            <div className="app-card-footer">
              {currentApp.status === possibleStatus[1] && (
                <Button
                  onClick={() => setIsStopDialogOpen(true)}
                  intent={Intent.WARNING}
                  className={"app-stop-process-button user-button-for-outline"}
                >
                  {t("stop_process")}
                </Button>
              )}
            </div>
          </Card>
          <Card className="see-more-app-card">
            <div className="half-circle"></div>
            <div className="app-card-header">
              <H5 className="app-card-title">{t("cv_section")}</H5>
            </div>
            <div className="app-card-body">
              <p className="see-more-app-cv">
                {t("cv_app_first_emp")}{" "}
                <span className="see-app-cv">{cvShortName}</span>.{" "}
                {t("cv_app_second_emp")}
              </p>
            </div>
            <div className="app-card-footer">
              <Button
                onClick={() => {
                  handleOpenCV({
                    cvName: cvShortName,
                    cvId: currentApp.cvId,
                    cvNameComplete: currentApp.cvName,
                  });
                }}
                className={"app-view-cv-button user-button-for-outline"}
                small
              >
                {t("view_cv")}
              </Button>
            </div>
          </Card>
          <Card className="see-more-app-card">
            <div className="half-circle"></div>
            <div className="app-card-header">
              <H5 className="app-card-title">{t("stage_section")}</H5>
            </div>
            <div className="app-card-body app-stages-card">
              {currentStagesForEmployer.map((stageValue, index) => (
                <div key={index} className="stage-item-general">
                  <div
                    className={
                      currentStageNr > index
                        ? "passed-staged"
                        : currentStageNr === index
                          ? "current-stage"
                          : "next-stage"
                    }
                  >
                    {t("stage_nr") + " " + (index + 1)}. {stageValue.stageName}{" "}
                    {currentStageNr === index && (
                      <Tag key={"current-stage"} intent={Intent.PRIMARY}>
                        {t("current_stage")}
                      </Tag>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="app-card-footer">
              {currentApp.status === possibleStatus[1] && (
                <Button
                  onClick={() => goToNextStep()}
                  intent={Intent.SUCCESS}
                  className={"app-next-step-button user-button-for-outline"}
                >
                  {t("next_step_app")}
                </Button>
              )}
            </div>
          </Card>
          {currentApp.allAnswers.length > 0 && (
            <Card className="see-more-app-card">
              <div className="half-circle"></div>
              <div className="app-card-header">
                <H5 className="app-card-title">{t("answers_section")}</H5>
              </div>
              <div className="app-card-body">
                {currentApp.allAnswers.map((answer, index) => (
                  <div key={index} className="question-item-general">
                    <div className="app-item-question">
                      {t("the_question") + " " + (index + 1)}.{" "}
                      {answer.questionText}
                    </div>
                    <div className="app-item-answer">
                      {t("answer_nr") + " " + (index + 1)}: {answer.answer}
                    </div>
                    <Divider />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
        <div className={Classes.DRAWER_FOOTER + " app-drawer"}>
          <Button
            onClick={() => openComplainDialog(currentApp?.candidateEmail)}
            intent={Intent.DANGER}
            icon="issue"
            className={"app-report-button user-button-for-outline"}
          >
            {t("report")}
          </Button>
        </div>
        <ComplaintDialog
          isOpen={complaintDialogOpen}
          onClose={closeComplainDialog}
          complainedUser={complainedUserEmail}
          complainantUser={complainantUserEmail}
        ></ComplaintDialog>
        {renderStopProcessDialog()}
      </Drawer>
    );
  };

  /**
   * Handle company change
   * @param {string} newValue
   */
  const handleCompanyChange = (newValue) => {
    let allFilters = { ...filters };
    let filter = [...allFilters.companyName];
    let index = filter.findIndex((ct) => ct === newValue);
    if (index === -1) {
      filter.push(newValue);
    } else {
      filter.splice(index, 1);
    }
    allFilters.companyName = filter;
    setFilters(allFilters);
  };

  const toggleExpansion = (index) => {
    if (expandedCards.includes(index)) {
      setExpandedCards(expandedCards.filter((item) => item !== index));
    } else {
      setExpandedCards([...expandedCards, index]);
    }
  };

  const isCardExpanded = (index) => expandedCards.includes(index);

  const getStatusIntent = (status) => {
    switch (status) {
      case 0:
        return "none";
      case 1:
        return "primary";
      case 2:
        return "success";
      default:
        return "none";
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    paginate(filteredApps, selected);
  };

  const renderAppList = () => (
    <div className="app-list-container">
      <div className="app-list-header">
        <div className="column-header">
          {employer && employer.employerId !== ""
            ? t("candidate_name")
            : t("job")}
        </div>
        {candidate && candidate.candidateId !== "" && (
          <div className="column-header">{t("the_company")}</div>
        )}
        <div className="column-header">{t("status_name")}</div>
        <div className="column-header user-table-sorted" onClick={toggleSort}>
          {t("date_name")} <Icon icon="double-caret-vertical"></Icon>
        </div>
        <div className="column-header">{t("action_name")}</div>
      </div>
      {paginatingApps.map((app, index) => (
        <div key={index}>{appInfoCard(app, index)}</div>
      ))}
    </div>
  );

  const renderNonExtendedCardEmployer = (app, formattedDate, index) => (
    <div className="app-list-container">
      <div className="app-nonextended-list">
        <div className="column-nonextended-list">
          {app.candidateFirstname} {app.candidateLastname}
        </div>
        <div className="column-nonextended-list">
          <Tag
            intent={getStatusIntent(
              possibleStatus.findIndex((i) => i === app.status),
            )}
          >
            {status[possibleStatus.findIndex((i) => i === app.status)]}
          </Tag>
        </div>
        <div className="column-nonextended-list">{formattedDate}</div>
        <div className="column-nonextended-list">
          <Tooltip content={t("extend")} position={"bottom"}>
            <Icon
              icon="chevron-down"
              className="user-button-for-outline"
              onClick={() => toggleExpansion(index)}
            />
          </Tooltip>
        </div>
      </div>
      <Divider />
    </div>
  );

  const renderNonExtendedCardCandidate = (app, formattedDate, index) => (
    <div className="app-list-container">
      <div className="app-nonextended-list">
        <div className="column-nonextended-list">{app.job.title}</div>
        <div className="column-nonextended-list">{app.employerCompanyName}</div>
        <div className="column-nonextended-list">
          <Tag
            intent={getStatusIntent(
              possibleStatus.findIndex((i) => i === app.status),
            )}
          >
            {status[possibleStatus.findIndex((i) => i === app.status)]}
          </Tag>
        </div>
        <div className="column-nonextended-list">{formattedDate}</div>
        <div className="column-nonextended-list">
          <Tooltip content={t("extend")}>
            <Icon icon="chevron-down" onClick={() => toggleExpansion(index)} />
          </Tooltip>
        </div>
      </div>
      <Divider />
    </div>
  );

  const renderExtendedCard = (app, formattedDate, index) => (
    <Card className="app-list-app-info-card">
      <div className="app-list-section">
        <div className="app-list-header-extended">
          <div className="app-list-section-title">{t("info_job")}</div>
          <div className="app-list-date">{formattedDate}</div>
        </div>
        <Divider />
        <p className="app-list-p">
          <span className="app-list-p-title">{t("the_title")}:</span>{" "}
          {app.job.title}
        </p>
        <p className="app-list-p">
          <span className="app-list-p-title">{t("the_company")}:</span>{" "}
          {app.employerCompanyName}
        </p>
        <p className="app-list-p">
          <span className="app-list-p-title">{t("contact")}:</span>{" "}
          {app.employerEmail}
        </p>
      </div>
      <div className="app-list-section">
        <Divider />
        <div className="app-list-section-title">{t("candidate_info")}</div>
        <Divider />
        <p className="app-list-p">
          <span className="app-list-p-title">{t("the_candidate")}:</span>{" "}
          {app.candidateFirstname} {app.candidateLastname}
        </p>
        <p className="app-list-p">
          <span className="app-list-p-title">{t("contact")}:</span>{" "}
          {app.candidateEmail}
        </p>
      </div>
      <div className="app-list-section">
        <Divider />
        <div className="app-list-header-extended">
          <div className="app-list-section-title">{t("process_info")}</div>
          <Button
            className="app-list-button user-button-for-outline"
            onClick={() => {
              setCurrentApp(app);
              toggleDrawer();
              if (
                app.stageNr === 0 &&
                app.status === possibleStatus[1] &&
                employer &&
                employer.employerId !== ""
              ) {
                goToSecondStep(app);
              }
            }}
            small
            minimal
            rightIcon={
              <Icon icon="layout-sorted-clusters" color="black" size={12} />
            }
          >
            {t("see_more")}
          </Button>
        </div>
        <Divider />
        <p className="app-list-p">
          <span className="app-list-p-title">Status: </span>
          <Tag
            intent={getStatusIntent(
              possibleStatus.findIndex((i) => i === app.status),
            )}
          >
            {status[possibleStatus.findIndex((i) => i === app.status)]}
          </Tag>
        </p>
        <p className="app-list-p">
          <span className="app-list-p-title">{t("current_stage")}:</span>{" "}
          {app.stageName}
        </p>
      </div>
      <div className="expand-icon">
        <Tooltip content={t("collapse")}>
          <Icon
            icon="chevron-up"
            className="user-button-for-outline"
            onClick={() => toggleExpansion(index)}
          />
        </Tooltip>
      </div>
    </Card>
  );

  const appInfoCard = (app, index) => {
    const isExpanded = isCardExpanded(index);
    const formattedDate = formatDate(app.appDate);

    if (isExpanded) {
      return renderExtendedCard(app, formattedDate, index);
    } else {
      if (employer && employer.employerId !== "") {
        return renderNonExtendedCardEmployer(app, formattedDate, index);
      } else {
        return renderNonExtendedCardCandidate(app, formattedDate, index);
      }
    }
  };

  const totalPages = Math.ceil(filteredApps.length / appsPerPage);

  let currentStages = i18n.language === "ro" ? stagesRo : stagesEng;

  return (
    <div>
      {candidate && candidate.candidateId !== "" ? (
        <HeaderPageCandidate />
      ) : (
        <HeaderPageEmployer />
      )}
      <div className={"jobs-component"}>
        <div className="filter-section filter-section-app">
          <div className="filter-section-header">
            <div className="filter-section-title">{t("filters_caps")}</div>
            <Tooltip content={t("reset_filters")} position="bottom">
              <Button
                className="reset-filter-button"
                onClick={handleFilterReset}
                small={true}
                minimal={true}
                icon={"reset"}
              ></Button>
            </Tooltip>
          </div>
          <FormGroup
            label={t("app_date")}
            className={`jobs-contractType-filter ${Classes.FIXED}`}
          >
            <Select
              items={date}
              fill={true}
              matchTargetWidth={true}
              filterable={false}
              itemRenderer={renderDateType}
              onItemSelect={(e) => handleDateSelect(e)}
              popoverProps={{ position: Position.BOTTOM }}
            >
              <Button
                text={
                  date[
                    possibleDates.findIndex((d) => d === filters.postingDate)
                  ]
                }
                rightIcon="caret-down"
                fill={true}
              />
            </Select>
          </FormGroup>
          <FormGroup
            label={t("status")}
            className={`jobs-contractType-filter ${Classes.FIXED}`}
          >
            <div className="job-status-checkbox-container">
              {status.map((s, index) => (
                <Checkbox
                  className="job-checkbox-item"
                  label={s}
                  checked={filters.status.includes(possibleStatus[index])}
                  onChange={() => handleStatusTypeChange(possibleStatus[index])}
                />
              ))}
            </div>
          </FormGroup>
          {employer && employer.employerId !== "" && (
            <FormGroup
              label={t("stage")}
              className={`jobs-contractType-filter ${Classes.FIXED}`}
            >
              {employer &&
              employer.employerId !== "" &&
              currentStages.length > 0 ? (
                <div className="job-checkbox-container job-checkbox-container-app">
                  {currentStages.map((obj, index) => (
                    <Checkbox
                      className="job-checkbox-item"
                      label={obj}
                      checked={filters.stageName.includes(stagesName[index])}
                      onChange={() => handleStageChange(stagesName[index])}
                    />
                  ))}
                </div>
              ) : (
                <div className="no-job-filter">{t("no_app_stage")}</div>
              )}
            </FormGroup>
          )}
          {candidate && candidate.candidateId !== "" && (
            <FormGroup
              label={t("company")}
              className={`jobs-contractType-filter ${Classes.FIXED}`}
            >
              {candidate &&
              candidate.candidateId !== "" &&
              companiesName.length > 0 ? (
                <div className="job-checkbox-container companiesName">
                  {companiesName.map((obj, index) => (
                    <Checkbox
                      className="job-checkbox-item"
                      label={obj}
                      checked={filters.companyName.includes(
                        companiesName[index],
                      )}
                      onChange={() => handleCompanyChange(companiesName[index])}
                    />
                  ))}
                </div>
              ) : (
                <div className="no-job-filter">{t("no_app_company")}</div>
              )}
            </FormGroup>
          )}
        </div>
        <div className={"right-section"}>
          <div className="page-title-display-flex">
            {employer && employer.employerId !== "" && (
              <div
                className="application-job-title go-to-job"
                onClick={() => {
                  dispatch(setJobData(openedJob));
                  navigate("/viewJob");
                }}
              >
                {openedJob.title} Applications
              </div>
            )}
            {candidate && candidate.candidateId !== "" && (
              <div className="application-job-title">{t("your_apps")}</div>
            )}
          </div>

          <div className={"job-page-buttons"}>
            <div className="results-show-left">
              {t("results")} ({filteredApps.length} {t("found")})
            </div>
            <div className="search-show-right">
              <InputGroup
                disabled={false}
                placeholder={
                  candidate && candidate.candidateId !== ""
                    ? t("search_by_job")
                    : t("search_by_candidate")
                }
                type="search"
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>
          <Divider />
          <div
            className={
              paginatingApps.length > 0 ? "jobs-list" : "jobs-non-ideal"
            }
          >
            {paginatingApps.length > 0 ? (
              <div className="jobs-list-show">
                <div className="just-jobs">{renderAppList()}</div>
              </div>
            ) : (
              <NonIdealState
                icon={<img src={SearchIcon} alt="Search icon" />}
                title={t("no_apps_found")}
                description={
                  candidate && candidate.candidateId !== ""
                    ? t("no_apps_explanation_can")
                    : t("no_apps_explanation_emp")
                }
              />
            )}
          </div>
          {paginatingApps.length > 0 && totalPages > 1 && (
            <ReactPaginate
              previousLabel={currentPage === 0 ? "" : "<"}
              nextLabel={currentPage === totalPages - 1 ? "" : ">"}
              breakLabel={"..."}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={totalPages}
              onPageChange={handlePageClick}
              containerClassName={"pagination-container"}
              pageClassName={"pagination-page-item"}
              activeClassName={"pagination-active"}
              breakClassName="pagination-page-item"
              previousClassName={
                currentPage === 0 ? "" : "pagination-prev-label"
              }
              nextClassName={
                currentPage === totalPages - 1 ? "" : "pagination-next-label"
              }
              renderOnZeroPageCount={null}
            />
          )}
          {employer &&
            employer.employerId !== "" &&
            currentApp &&
            renderTemplateCvDrawerEmployer()}
          {candidate &&
            candidate.candidateId !== "" &&
            currentApp &&
            renderTemplateCvDrawerCandidate()}
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;
