import React, { useEffect, useState } from "react";
import {
  Tooltip,
  Button,
  Checkbox,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
  NonIdealState,
  Position,
  MenuItem,
  Icon,
  Spinner,
} from "@blueprintjs/core";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import SearchIcon from "../../resources-photo/svg/no_job.svg";
import { Select } from "@blueprintjs/select";
import Image from "../../resources-photo/No_profile_image.jpg";
import { useNavigate } from "react-router-dom";
import JobService from "../../services/job.service";
import { formatDate } from "../common/CommonMethods";
import { setJobData } from "../../redux/actions/jobActions";
import { AppToaster } from "../common/AppToaster";
import "./JobsPage.css";
import HeaderPageCandidate from "../header/HeaderPageCandidate";
import HeaderPageEmployer from "../header/HeaderPageEmployer";
import ProfileService from "../../services/profile.service";
import AddJobDialog from "./AddJobDialog";
import {
  BUCHAREST_ENG,
  BUCHAREST_RO,
  CLOSED,
  OPENED,
} from "../../util/constants";
import ReactPaginate from "react-paginate";
import { setFilterData } from "../../redux/actions/filtersActions";
import JobTime from "./JobTime";

export const industriesRo = [
  "Toate industriile",
  "Administrație",
  "Agricultură",
  "Arhitectură/Design interior",
  "Audit",
  "Bănci",
  "Chimie/Petrochimie",
  "Construcții/Instalații",
  "Educație",
  "Finanțe",
  "Imobiliare",
  "Inginerie",
  "IT Hardware",
  "IT Software",
  "Juridic",
  "Management",
  "Marketing",
  "Media/Jurnalism",
  "Psihologie",
  "Publicitate",
  "Radio/Televiziune",
  "Relații clienți",
  "Relații publice",
  "Resurse umane",
  "Telecomunicații",
  "Tipografie/Editură",
  "Traduceri",
  "Transport/Distribuție",
  "Turism",
  "Vânzări",
];
export const industriesEng = [
  "All industries",
  "Administration",
  "Agriculture",
  "Architecture/Interior Design",
  "Audit",
  "Banks",
  "Chemistry/Petro-chemistry",
  "Construction/Installations",
  "Education",
  "Finance",
  "Real Estate",
  "Engineering",
  "IT Hardware",
  "IT Software",
  "Legal",
  "Management",
  "Marketing",
  "Media/Journalism",
  "Psychology",
  "Advertising",
  "Radio/Television",
  "Customer Relations",
  "Public Relations",
  "Human Resources",
  "Telecommunications",
  "Printing/Publishing",
  "Translations",
  "Transportation/Distribution",
  "Tourism",
  "Sales",
];

export const possibleExperiences = ["Entry-Level", "Junior", "Intermediar"];
export const experiencesRo = [
  "Entry-Level (0 ani)",
  "Junior (0-2 ani)",
  "Intermediar (2-4 ani)",
];
export const experiencesEng = [
  "Entry-Level (0 years)",
  "Junior (0-2 years)",
  "Intermediary (2-4 years)",
];

export const possibleContractType = [
  "Norma intreaga",
  "Norma redusa",
  "Norma variabila",
];
export const contractEn = ["Full-time", "Part-time", "Freelance"];
export const contractRo = ["Full-time", "Part-time", "Variabil"];

export const possibleRegimeEmp = [
  "Contract determinat",
  "Stagiu",
  "Contract nedeterminat",
  "Proiect",
];
export const regimeEn = [
  "Fixed-term Contract",
  "Internship",
  "Indefinite-term Contract",
  "Project",
];
export const regimeRo = [
  "Contract determinat",
  "Stagiu",
  "Contract nedeterminat",
  "Proiect",
];

export const possibleWorkMode = ["On-Site", "Remote", "Hibrid"];
export const workEn = ["On-Site", "Remote", "Hybrid"];
export const workRo = ["La birou", "La distanță", "Hibrid"];

export const possibleDates = [
  "Oricand",
  "Luna trecuta",
  "Saptamana trecuta",
  "Ziua trecuta",
];
export const dateEn = [
  "Anytime",
  "In the last month",
  "In the last week",
  "In the last day",
];
export const dateRo = [
  "Oricând",
  "În ultima lună",
  "În ultima săptămână",
  "În ultima zi",
];

export const possibleStatus = [CLOSED, OPENED];
export const statusEn = ["Closed", "Opened"];
export const statusRo = ["Închis", "Deschis"];

const viewEn = ["All jobs", "Relevant jobs"];
const viewRo = ["Toate postările", "Postările relevante"];

const dateSortEn = ["Ascending", "Descending"];
const dateSortRo = ["Crescător", "Descrescător"];

const JobsPage = () => {
  const { t, i18n } = useTranslation();
  const candidate = useSelector((state) => state.auth.candidate);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const industries = i18n.language === "ro" ? industriesRo : industriesEng;
  const experiences = i18n.language === "ro" ? experiencesRo : experiencesEng;
  const contracts = i18n.language === "ro" ? contractRo : contractEn;
  const regimes = i18n.language === "ro" ? regimeRo : regimeEn;
  const works = i18n.language === "ro" ? workRo : workEn;
  const date = i18n.language === "ro" ? dateRo : dateEn;
  const status = i18n.language === "ro" ? statusRo : statusEn;

  const defaultIndustry = "Toate industriile";
  const employer = useSelector((state) => state.auth.employer);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // States
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [jobs, setJobs] = useState([]);
  const recommendedJobsFromRedux = useSelector(
    (state) => state.filters.recommendedJobs,
  );
  const [recommendedJobs, setRecommendedJobs] = useState([
    ...recommendedJobsFromRedux,
  ]);
  const [showBasedOnRecommendation, setShowBasedOnRecommendation] =
    useState(false);
  const [orderByPostDate, setOrderByPostDate] = useState(0);
  const views = i18n.language === "ro" ? viewRo : viewEn;
  const sortDate = i18n.language === "ro" ? dateSortRo : dateSortEn;

  const [filters, setFilters] = useState({
    contractType: possibleContractType,
    employmentRegime: possibleRegimeEmp,
    experience: possibleExperiences,
    industry: defaultIndustry,
    workMode: possibleWorkMode,
    cityName: "All",
    postingDate: possibleDates[0],
    status: [possibleStatus[1]],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState([]);

  // Paginating
  const [currentPage, setCurrentPage] = useState(0);
  const jobsPerPage = 6; // Number of jobs per page
  const [currentJobs, setCurrentJobs] = useState([]);

  // For keeping the filters and recommended jobs
  const filtersForJobsFromRedux = useSelector(
    (state) => state.filters.filtersForJobs,
  );
  const sortDateForJobsFromRedux = useSelector(
    (state) => state.filters.sortDateForJobs,
  );
  const viewsForJobFromRedux = useSelector(
    (state) => state.filters.viewsForJob,
  );
  const currentPageFromRedux = useSelector(
    (state) => state.filters.currentPage,
  );
  const [areJobsRetrieved, setAreJobsRetrieved] = useState(true);

  /**
   * Method that call the job retrieval on first renderer
   */
  useEffect(() => {
    if (
      filtersForJobsFromRedux &&
      filtersForJobsFromRedux.contractType.length > 0
    ) {
      setFilters(filtersForJobsFromRedux);
    }
    if (sortDateForJobsFromRedux) {
      setOrderByPostDate(sortDateForJobsFromRedux);
    }
    if (viewsForJobFromRedux) {
      setShowBasedOnRecommendation(viewsForJobFromRedux);
    }
    if (candidate && candidate.candidateId !== "") {
      getJobsAsCandidate();
    } else {
      if (employer && employer.employerId !== "") {
        getJobsAsEmployer();
        getProfile();
      }
    }
  }, []);

  useEffect(() => {
    setRecommendedJobs(recommendedJobsFromRedux);
  }, [recommendedJobsFromRedux]);

  /**
   * Method that handle the filtering
   */
  useEffect(() => {
    let currentPageFiltering = 0;
    if (currentPageFromRedux) {
      currentPageFiltering = currentPageFromRedux;
    }
    let allJobs;
    if (showBasedOnRecommendation) {
      allJobs = [...recommendedJobs];
    } else {
      allJobs = [...jobs];
    }
    let filtered = allJobs.filter((job) => {
      return (
        (job.title.toLowerCase().includes(searchTerm) ||
          (candidate &&
            candidate.candidateId !== "" &&
            job.employer.companyName &&
            job.employer.companyName.toLowerCase().includes(searchTerm))) &&
        filters.contractType.includes(job.contractType) &&
        filters.employmentRegime.includes(job.employmentRegime) &&
        filters.workMode.includes(job.workMode) &&
        filters.experience.includes(job.experience) &&
        filters.status.includes(job.status) &&
        (filters.industry === job.industry ||
          filters.industry === "Toate industriile") &&
        (filters.cityName === job.cityName || filters.cityName === "All") &&
        filterByDate(filters.postingDate, job.postingDate)
      );
    });
    if (!showBasedOnRecommendation) {
      if (orderByPostDate === 1) {
        filtered.sort(
          (a, b) => new Date(a.postingDate) - new Date(b.postingDate),
        );
      } else {
        filtered.sort(
          (a, b) => new Date(b.postingDate) - new Date(a.postingDate),
        );
      }
    }

    setFilteredJobs(filtered);
    if (parseInt(filtered.length / jobsPerPage) < currentPageFiltering) {
      currentPageFiltering = parseInt(filtered.length / jobsPerPage);
    }
    paginate(filtered, currentPageFiltering);
    dispatch(
      setFilterData(
        filters,
        orderByPostDate,
        showBasedOnRecommendation,
        recommendedJobs,
        currentPageFiltering,
      ),
    );
  }, [
    jobs,
    filters,
    searchTerm,
    orderByPostDate,
    showBasedOnRecommendation,
    recommendedJobs,
  ]);

  /**
   * Method to retrieve job list for candidate
   */
  const getJobsAsEmployer = () => {
    JobService.getAllJobsForEmployer(employer.employerId)
      .then((response) => {
        let jobsResponse = [...response.data];
        let citiesResponse = [...new Set(jobsResponse.map((j) => j.cityName))];
        setJobs(jobsResponse);
        setCities(["All", ...citiesResponse]);
        setFilteredJobs(jobsResponse);
      })
      .catch((error) => {
        console.error("Error: ", error.message);
        AppToaster.show({
          message: t("job_list_err"),
          intent: Intent.DANGER,
        });
      });
  };

  /**
   * Method to retrieve job list for candidate
   */
  const getJobsAsCandidate = () => {
    JobService.getAllJobs()
      .then((response) => {
        let jobsResponse = [...response.data];
        let citiesResponse = [...new Set(jobsResponse.map((j) => j.cityName))];
        setJobs(jobsResponse);
        setCities(["All", ...citiesResponse]);
        setFilteredJobs(jobsResponse);
        if (recommendedJobsFromRedux && recommendedJobsFromRedux.length > 0) {
          setRecommendedJobs(recommendedJobsFromRedux);
        } else {
          setAreJobsRetrieved(false);
          JobService.getRecommendedJobs(candidate.candidateId)
            .then((responseRecommended) => {
              setAreJobsRetrieved(true);
              setRecommendedJobs(responseRecommended.data);
            })
            .catch((error) => {
              console.error("Error: ", error.message);
              AppToaster.show({
                message: t("job_list_err"),
                intent: Intent.DANGER,
              });
            });
        }
      })
      .catch((error) => {
        console.error("Error: ", error.message);
        AppToaster.show({
          message: t("job_list_err"),
          intent: Intent.DANGER,
        });
      });
  };

  const getProfile = () => {
    ProfileService.getProfile(employer.userDetails.email)
      .then((response) => {
        let profileResponse = response.data;
        setProfilePhoto(profileResponse.imagine);
      })
      .catch((error) => {
        console.error("Error: ", error.message);
        AppToaster.show({
          message: t("profile_err"),
          intent: Intent.DANGER,
        });
      });
  };

  /**
   * Return true if the job is posted in the selected time, false otherwise
   * @param {string} filtersDate
   * @param {string} jobDate
   */
  const filterByDate = (filtersDate, jobDate) => {
    // Anytime
    if (filtersDate === possibleDates[0]) {
      return true;
    }
    // Past month
    if (filtersDate === possibleDates[1]) {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      if (new Date(jobDate) >= oneMonthAgo) {
        return true;
      }
    }
    // Past week
    if (filtersDate === possibleDates[2]) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      if (new Date(jobDate) >= oneWeekAgo) {
        return true;
      }
    }
    // Past day
    if (filtersDate === possibleDates[3]) {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      if (new Date(jobDate) >= oneDayAgo) {
        return true;
      }
    }
    return false;
  };

  const handleViewsChange = (view) => {
    if (view === viewRo[0] || view === viewEn[0]) {
      setShowBasedOnRecommendation(false);
    } else {
      handlePageClick(0);
      setShowBasedOnRecommendation(true);
    }
  };

  /**
   * Choose how to sort the jobs by date
   */
  const handleDateSortChange = (sort) => {
    if (sort === dateSortRo[0] || sort === dateSortEn[0]) {
      setOrderByPostDate(0);
    } else {
      setOrderByPostDate(1);
    }
  };

  /**
   * Handle filters reset
   */
  const handleFilterReset = () => {
    setFilters({
      contractType: possibleContractType,
      employmentRegime: possibleRegimeEmp,
      experience: possibleExperiences,
      industry: defaultIndustry,
      workMode: possibleWorkMode,
      cityName: "All",
      status: [possibleStatus[1]],
      postingDate: possibleDates[0],
    });
  };

  /**
   * Handle contract type change
   * @param {string} newValue
   */
  const handleContractTypeChange = (newValue) => {
    let allFilters = { ...filters };
    let filterContractType = [...allFilters.contractType];
    let index = filterContractType.findIndex((ct) => ct === newValue);
    if (index === -1) {
      // A contract type filter is added
      filterContractType.push(newValue);
    } else {
      // A contract type filter is deleted
      filterContractType.splice(index, 1);
    }
    allFilters.contractType = filterContractType;
    setFilters(allFilters);
  };

  /**
   * Handle status change
   * @param {string} newValue
   */
  const handleStatusChange = (newValue) => {
    let allFilters = { ...filters };
    let filter = [...allFilters.status];
    let index = filter.findIndex((ct) => ct === newValue);
    if (index === -1) {
      // A regime type filter is added
      filter.push(newValue);
    } else {
      // A regime filter is deleted
      filter.splice(index, 1);
    }
    allFilters.status = filter;
    setFilters(allFilters);
  };

  /**
   * Handle employment regime change
   * @param {string} newValue
   */
  const handleRegimeChange = (newValue) => {
    let allFilters = { ...filters };
    let filter = [...allFilters.employmentRegime];
    let index = filter.findIndex((ct) => ct === newValue);
    if (index === -1) {
      // A regime type filter is added
      filter.push(newValue);
    } else {
      // A regime filter is deleted
      filter.splice(index, 1);
    }
    allFilters.employmentRegime = filter;
    setFilters(allFilters);
  };

  /**
   * Handle experiences change
   * @param {string} newValue
   */
  const handleExpChange = (newValue) => {
    let allFilters = { ...filters };
    let filter = [...allFilters.experience];
    let index = filter.findIndex((ct) => ct === newValue);
    if (index === -1) {
      filter.push(newValue);
    } else {
      filter.splice(index, 1);
    }
    allFilters.experience = filter;
    setFilters(allFilters);
  };

  /**
   * Handle work mode change
   * @param {string} newValue
   */
  const handleWorkModeChange = (newValue) => {
    let allFilters = { ...filters };
    let filter = [...allFilters.workMode];
    let index = filter.findIndex((ct) => ct === newValue);
    if (index === -1) {
      filter.push(newValue);
    } else {
      filter.splice(index, 1);
    }
    allFilters.workMode = filter;
    setFilters(allFilters);
  };

  /**
   * Handle industry change
   * @param {string} newValue
   */
  const handleIndustryChange = (newValue) => {
    let allFilters = { ...filters };
    allFilters.industry = newValue;
    setFilters(allFilters);
  };

  /**
   * Handle city change
   * @param {string} newValue
   */
  const handleCityChange = (newValue) => {
    let allFilters = { ...filters };
    allFilters.cityName = newValue;
    setFilters(allFilters);
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
   * Handle search term change
   * @param {string} newValue
   */
  const handleSearchChange = (newValue) => {
    setSearchTerm(newValue.toLowerCase());
  };

  /**
   * Methods used for viewing a job
   */
  const viewJob = (job) => {
    dispatch(setJobData(job));
    navigate("/viewJob");
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

  const handleDateSelect = (selectedDate) => {
    let index = date.findIndex((i) => i === selectedDate);
    if (index > -1) {
      handleDateChange(possibleDates[index]);
    }
  };

  /**
   * Changes the page and calculates jobs for the current page
   * @param filteredJobsList
   * @param pageNumber
   */
  const paginate = (filteredJobsList, pageNumber) => {
    const indexOfLastJob = (pageNumber + 1) * jobsPerPage;
    const indexOfFirstJob = pageNumber * jobsPerPage;
    const jobsForPage = filteredJobsList.slice(indexOfFirstJob, indexOfLastJob);
    setCurrentJobs(jobsForPage);
    setCurrentPage(pageNumber);
  };

  /**
   * Used for searching the industries
   * @param query The rule against the item is checked
   * @param item Item to be checked
   * @param _index
   * @param _exactMatch
   * @returns
   */
  const filterIndustries = (query, item, _index, _exactMatch) => {
    return item.toLowerCase().indexOf(query.toLowerCase()) > -1;
  };

  const renderObj = (obj, { handleClick, modifiers, _query }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    let text = obj;
    if (obj === "București" && i18n.language === "en") {
      text = "Bucharest";
    } else if (obj === "București" && i18n.language === "ro") {
      text = "București";
    }
    if (obj === "All" && i18n.language === "en") {
      text = "All";
    } else if (obj === "All" && i18n.language === "ro") {
      text = "Toate";
    }
    return (
      <MenuItem
        active={modifiers.active}
        disabled={modifiers.disabled}
        text={text}
        key={obj}
        onClick={handleClick}
        shouldDismissPopover={true}
      />
    );
  };

  /**
   * Handle dialog action
   */
  const handleDialogAction = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    paginate(filteredJobs, selected);
    dispatch(
      setFilterData(
        filters,
        orderByPostDate,
        showBasedOnRecommendation,
        recommendedJobs,
        selected,
      ),
    );
  };

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  let currentCityTag = filters.cityName;
  if (filters.cityName === "All" && i18n.language === "ro") {
    currentCityTag = "Toate";
  } else if (filters.cityName === "All" && i18n.language === "en") {
    currentCityTag = "All";
  }
  if (filters.cityName === "București" && i18n.language === "ro") {
    currentCityTag = "București";
  } else if (filters.cityName === "București" && i18n.language === "en") {
    currentCityTag = "Bucharest";
  }

  return (
    <div>
      {candidate && candidate.candidateId !== "" ? (
        <HeaderPageCandidate />
      ) : (
        <HeaderPageEmployer />
      )}
      <div className={"jobs-component"}>
        <div className="filter-section">
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
            label={t("posting_date")}
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
              activeItem={
                date[possibleDates.findIndex((d) => d === filters.postingDate)]
              }
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
          {employer && employer.employerId !== "" && (
            <FormGroup
              label={t("status")}
              className={`jobs-contractType-filter ${Classes.FIXED}`}
            >
              <div className="job-checkbox-container">
                {status.map((obj, index) => (
                  <Checkbox
                    className="job-checkbox-item"
                    label={obj}
                    checked={filters.status.includes(possibleStatus[index])}
                    onChange={() => handleStatusChange(possibleStatus[index])}
                  />
                ))}
              </div>
            </FormGroup>
          )}
          <FormGroup
            label={t("contract_type")}
            className={`jobs-contractType-filter ${Classes.FIXED}`}
          >
            <div className="job-checkbox-container">
              {contracts.map((contractType, index) => (
                <Checkbox
                  className="job-checkbox-item"
                  label={contractType}
                  checked={filters.contractType.includes(
                    possibleContractType[index],
                  )}
                  onChange={() =>
                    handleContractTypeChange(possibleContractType[index])
                  }
                />
              ))}
            </div>
          </FormGroup>
          <FormGroup
            label={t("employment_regime")}
            className={`jobs-contractType-filter ${Classes.FIXED}`}
          >
            <div className="job-checkbox-container">
              {regimes.map((regime, index) => (
                <Checkbox
                  className="job-checkbox-item"
                  label={regime}
                  checked={filters.employmentRegime.includes(
                    possibleRegimeEmp[index],
                  )}
                  onChange={() => handleRegimeChange(possibleRegimeEmp[index])}
                />
              ))}
            </div>
          </FormGroup>
          <FormGroup
            label={t("experience")}
            className={`jobs-contractType-filter ${Classes.FIXED}`}
          >
            <div className="job-checkbox-container">
              {experiences.map((obj, index) => (
                <Checkbox
                  className="job-checkbox-item"
                  label={obj}
                  checked={filters.experience.includes(
                    possibleExperiences[index],
                  )}
                  onChange={() => handleExpChange(possibleExperiences[index])}
                />
              ))}
            </div>
          </FormGroup>
          <FormGroup
            label={t("work_mode")}
            className={`jobs-contractType-filter ${Classes.FIXED}`}
          >
            <div className="job-checkbox-container">
              {works.map((obj, index) => (
                <Checkbox
                  className="job-checkbox-item"
                  label={obj}
                  checked={filters.workMode.includes(possibleWorkMode[index])}
                  onChange={() => handleWorkModeChange(possibleWorkMode[index])}
                />
              ))}
            </div>
          </FormGroup>
          <FormGroup
            label={t("industry")}
            className={`jobs-contractType-filter ${Classes.FIXED}`}
          >
            <Select
              items={industries}
              fill={true}
              matchTargetWidth={true}
              filterable={true}
              itemRenderer={renderDateType}
              itemPredicate={filterIndustries}
              onItemSelect={(e) =>
                handleIndustryChange(
                  industriesRo[industries.findIndex((d) => d === e)],
                )
              }
              popoverProps={{ position: Position.BOTTOM }}
              activeItem={
                industries[
                  industriesRo.findIndex((d) => d === filters.industry)
                ]
              }
            >
              <Button
                text={
                  industries[
                    industriesRo.findIndex((d) => d === filters.industry)
                  ]
                }
                rightIcon="caret-down"
                fill={true}
              />
            </Select>
          </FormGroup>
          <FormGroup
            label={t("city")}
            className={`jobs-contractType-filter ${Classes.FIXED}`}
          >
            {cities.length > 0 ? (
              <Select
                items={cities}
                fill={true}
                matchTargetWidth={true}
                filterable={false}
                itemRenderer={renderObj}
                onItemSelect={(e) => handleCityChange(e)}
                popoverProps={{ position: Position.BOTTOM }}
                activeItem={filters.cityName}
              >
                <Button
                  text={currentCityTag}
                  rightIcon="caret-down"
                  fill={true}
                  className={"user-button-for-outline"}
                />
              </Select>
            ) : (
              <div className="no-job-filter">{t("no_job_city")}</div>
            )}
          </FormGroup>
        </div>
        <div className={"right-section"}>
          {employer && employer.employerId !== "" && (
            <Button
              className="add-job-button"
              onClick={handleDialogAction}
              icon={<Icon icon="plus" color="black" />}
            >
              {t("add_new_job_button")}
            </Button>
          )}
          <div className={"job-page-buttons"}>
            <div className="job-page-second-line-buttons">
              <div className="search-job">
                <InputGroup
                  disabled={false}
                  placeholder={
                    candidate && candidate.candidateId !== ""
                      ? t("search_by_title_or_company")
                      : t("search_by_title")
                  }
                  className="search-job-input"
                  type="search"
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              <div className="job-filter-div">
                {candidate && candidate.candidateId !== "" && (
                  <FormGroup
                    label={t("view") + ": "}
                    inline
                    className="job-filter-form"
                  >
                    <Select
                      items={views}
                      fill={true}
                      matchTargetWidth={true}
                      filterable={false}
                      itemRenderer={renderObj}
                      onItemSelect={(e) => handleViewsChange(e)}
                      popoverProps={{ position: Position.BOTTOM }}
                      activeItem={
                        showBasedOnRecommendation ? views[1] : views[0]
                      }
                    >
                      <Button
                        text={showBasedOnRecommendation ? views[1] : views[0]}
                        rightIcon="caret-down"
                        fill={true}
                        className={"user-button-for-outline"}
                      />
                    </Select>
                  </FormGroup>
                )}

                <FormGroup
                  label={t("sort_by_date") + ": "}
                  inline
                  className={
                    "job-filter-form " +
                    (employer && employer.employerId ? "job-filer-lonely" : "")
                  }
                >
                  <Select
                    items={sortDate}
                    fill={true}
                    matchTargetWidth={true}
                    filterable={false}
                    itemRenderer={renderObj}
                    onItemSelect={(e) => handleDateSortChange(e)}
                    popoverProps={{ position: Position.BOTTOM }}
                    activeItem={
                      orderByPostDate === 1 ? sortDate[1] : sortDate[0]
                    }
                    disabled={showBasedOnRecommendation}
                  >
                    <Button
                      text={orderByPostDate === 1 ? sortDate[1] : sortDate[0]}
                      rightIcon="caret-down"
                      fill={true}
                      className={"user-button-for-outline"}
                    />
                  </Select>
                </FormGroup>
              </div>
            </div>
          </div>
          <div
            className={currentJobs.length > 0 ? "jobs-list" : "jobs-non-ideal"}
          >
            {showBasedOnRecommendation && !areJobsRetrieved ? (
              <Spinner className="central-spinner" size={40} />
            ) : currentJobs.length > 0 ? (
              <div className="jobs-list-show">
                <div className="just-jobs">
                  {currentJobs.map((job) => (
                    <div className="job-item" key={job.id}>
                      <div className="jobs-company-logo">
                        {candidate &&
                        candidate.candidateId !== "" &&
                        job.employerProfile.imagine ? (
                          <img
                            className="job-profile-image"
                            src={`data:image/jpeg;base64,${job.employerProfile.imagine}`}
                            alt="Company Logo"
                          />
                        ) : employer &&
                          employer.employerId !== "" &&
                          profilePhoto ? (
                          <img
                            className="job-profile-image"
                            src={`data:image/jpeg;base64,${profilePhoto}`}
                            alt="Company Logo"
                          />
                        ) : (
                          <img
                            className="job-profile-image"
                            src={Image}
                            alt="Company Logo"
                          />
                        )}
                      </div>
                      <div className="job-details">
                        <div className="jobs-detail-text">
                          <div className="jobs-detail">
                            <div className="job-text-date">
                              {formatDate(job.postingDate)} (
                              <JobTime postingDate={job.postingDate} />
                              {t("ago")})
                            </div>
                          </div>
                          <div className="jobs-detail">
                            <div
                              className="job-text-title"
                              onClick={() => {
                                viewJob(job);
                              }}
                            >
                              {job.title}{" "}
                              {employer &&
                              employer.employerId !== "" &&
                              job.status === CLOSED
                                ? t("closed_job")
                                : ""}
                            </div>
                          </div>
                          {candidate && candidate.candidateId !== "" && (
                            <div className="jobs-detail">
                              <div className="job-text-company">
                                {t("company_name")}: {job.employer.companyName}
                              </div>
                            </div>
                          )}
                          <div className="jobs-detail-in-row">
                            <div className="jobs-detail">
                              <Icon icon="route" className="icon" />
                              <div className="job-text">
                                {job.cityName === BUCHAREST_RO &&
                                i18n.language === "en"
                                  ? BUCHAREST_ENG
                                  : job.cityName === BUCHAREST_ENG &&
                                      i18n.language === "ro"
                                    ? BUCHAREST_RO
                                    : job.cityName}
                                ,
                                {" " +
                                  (job.regionName === BUCHAREST_RO &&
                                  i18n.language === "en"
                                    ? BUCHAREST_ENG
                                    : job.regionName === BUCHAREST_ENG &&
                                        i18n.language === "ro"
                                      ? BUCHAREST_RO
                                      : job.regionName)}
                              </div>
                            </div>
                            <div className="jobs-detail">
                              <Icon icon="application" className="icon" />
                              <div className="job-text">
                                {
                                  experiences[
                                    possibleExperiences.findIndex(
                                      (i) => i === job.experience,
                                    )
                                  ]
                                }
                              </div>
                            </div>
                            <div className="jobs-detail">
                              <Icon icon="globe-network" className="icon" />
                              <div className="job-text">
                                {
                                  industries[
                                    industriesRo.findIndex(
                                      (i) => i === job.industry,
                                    )
                                  ]
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                        <Tooltip
                          className="show-job-tooltip"
                          content={t("see_more_about_job")}
                          position="bottom-left"
                        >
                          <Button
                            className="show-job-button"
                            onClick={() => {
                              viewJob(job);
                            }}
                            small
                            minimal
                            rightIcon={
                              <Icon
                                size={13}
                                icon="layout-sorted-clusters"
                                color="black"
                              />
                            }
                          >
                            {t("see_more")}
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  {filteredJobs.length > 0 && totalPages > 1 && (
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
                        currentPage === totalPages - 1
                          ? ""
                          : "pagination-next-label"
                      }
                      renderOnZeroPageCount={null}
                      forcePage={currentPage}
                    />
                  )}
                </div>
              </div>
            ) : (
              <NonIdealState
                icon={<img src={SearchIcon} alt="Search icon" />}
                title={t("no_jobs_found")}
                description={t("no_jobs_explanation")}
              />
            )}
          </div>
          <AddJobDialog
            isDialogOpen={isDialogOpen}
            handleDialogAction={handleDialogAction}
            handleJobAddition={getJobsAsEmployer}
          />
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
