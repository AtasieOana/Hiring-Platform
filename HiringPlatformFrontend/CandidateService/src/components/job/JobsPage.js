import React, {useEffect, useState} from 'react';
import HeaderPage from "../header/HeaderPage";
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
} from "@blueprintjs/core";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import SearchIcon from '../../resources-photo/svg/no_job.svg';
import {Select} from "@blueprintjs/select";
import Image from "../../resources-photo/No_profile_image.jpg";
import {useNavigate} from "react-router-dom";
import JobService from "../../services/job.service";
import {formatDate} from "../common/CommonMethods";
import {setJobData} from "../../redux/actions/jobActions";
import {AppToaster} from "../common/AppToaster";
import "./JobsPage.css"

export const industriesRo = [
    "Toate industriile", "Administrație", "Agricultură", "Arhitectură/Design interior", "Audit",
    "Bănci", "Chimie/Petrochimie", "Construcții/Instalații", "Educație", "Finanțe",
    "Imobiliare", "Inginerie", "IT Hardware", "IT Software", "Juridic", "Management", "Marketing",
    "Media/Jurnalism", "Psihologie", "Publicitate", "Radio/Televiziune", "Relații clienți",
    "Relații publice", "Resurse umane", "Telecomunicații",
    "Tipografie/Editură", "Traduceri", "Transport/Distribuție", "Turism", "Vânzări"
];
export const industriesEng = [
    "All industries", "Administration", "Agriculture", "Architecture/Interior Design", "Audit", "Banks",
    "Chemistry/Petro-chemistry", "Construction/Installations", "Education", "Finance",
    "Real Estate", "Engineering", "IT Hardware", "IT Software", "Legal", "Management", "Marketing",
    "Media/Journalism", "Psychology", "Advertising", "Radio/Television", "Customer Relations",
    "Public Relations", "Human Resources", "Telecommunications",
    "Printing/Publishing", "Translations", "Transportation/Distribution", "Tourism", "Sales"
];

export const possibleExperiences = ['Entry-Level', 'Junior', 'Intermediar']
export const experiencesRo = ["Entry-Level (0 ani)", "Junior (0-2 ani)", "Intermediar (2-4 ani)"];
export const experiencesEng = ["Entry-Level (0 years)", "Junior (0-2 years)", "Intermediary (2-4 years)"];

export const possibleContractType = ['Norma intreaga', 'Norma redusa', 'Norma variabila']
export const contractEn = ["Full-time", "Part-time", "Freelance"]
export const contractRo = ["Full-time", "Part-time", "Variabil"]

export const possibleRegimeEmp = ['Contract determinat', 'Stagiu', 'Contract nedeterminat', 'Proiect']
export const regimeEn = ["Fixed-term Contract", "Internship", "Indefinite-term Contract", "Project"]
export const regimeRo = ["Contract determinat", "Stagiu", "Contract nedeterminat", "Proiect"]

export const possibleWorkMode = ['On-Site', 'Remote', 'Hibrid']
export const workEn = ["On-Site", "Remote", "Hybrid"]
export const workRo = ["La birou", "La distanță", "Hibrid"]

export const possibleDates = ['Oricand', 'Luna trecuta', 'Saptamana trecuta', 'Ziua trecuta']
export const dateEn = ["Anytime", "In the last month", "In the last week", "In the last day"]
export const dateRo = ["Oricând", "În ultima lună", "În ultima săptămână", "În ultima zi"]

const JobsPage = () => {

    const {t, i18n} = useTranslation();
    const candidate = useSelector(state => state.auth.candidate);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const industries = i18n.language === "ro" ? industriesRo : industriesEng
    const experiences = i18n.language === "ro" ? experiencesRo : experiencesEng
    const contracts = i18n.language === "ro" ? contractRo : contractEn
    const regimes = i18n.language === "ro" ? regimeRo : regimeEn
    const works = i18n.language === "ro" ? workRo : workEn
    const date = i18n.language === "ro" ? dateRo : dateEn

    const defaultIndustry = i18n.language === "ro" ? "Toate industriile" : "All industries"

    // States
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({
        contractType: possibleContractType,
        employmentRegime: possibleRegimeEmp,
        experience: possibleExperiences,
        industry: defaultIndustry,
        workMode: possibleWorkMode,
        cityName: [],
        regionName: [],
        countryName: [],
        postingDate: possibleDates[0],
    });
    const [orderByPostDate, setOrderByPostDate] = useState(0)
    const [searchTerm, setSearchTerm] = useState('');
    const [cities, setCities] = useState([])
    const [regions, setRegions] = useState([])
    const [countries, setCountries] = useState([])
    // Paginating
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 5; // Number of jobs per page
    const [currentJobs, setCurrentJobs] = useState([]);

    /**
     * Method that call the job retrieval on first renderer
     */
    useEffect(() => {
        getJobs()
    }, []);

    /**
     * Method that handle the filtering
     */
    useEffect(() => {
        setCurrentPage(1)
        // Filter by contract type
        let allJobs = [...jobs]
        let filtered = allJobs.filter(job =>
            (job.title.toLowerCase().includes(searchTerm) ||
            job.employer.companyName.toLowerCase().includes(searchTerm))
            && filters.contractType.includes(job.contractType)
            && filters.employmentRegime.includes(job.employmentRegime)
            && filters.workMode.includes(job.workMode)
            && filters.experience.includes(job.experience)
            && (filters.industry.includes(job.industry) || filters.industry === defaultIndustry)
            && filters.cityName.includes(job.cityName)
            && filters.regionName.includes(job.regionName)
            && filters.countryName.includes(job.countryName)
            && filterByDate(filters.postingDate, job.postingDate))
        if(orderByPostDate === 1) {
            filtered.sort((a, b) => new Date(a.postingDate) - new Date(b.postingDate));
        }
        else{
            filtered.sort((a, b) => new Date(b.postingDate) - new Date(a.postingDate));
        }
        setFilteredJobs(filtered);
        paginate(filtered, 1);
    }, [jobs, filters, searchTerm, orderByPostDate]);

    /**
     * Method to retrieve job list for candidate
     */
    const getJobs = () => {
        JobService.getAllJobs()
            .then((response) => {
                let jobsResponse = [...response.data]
                let citiesResponse = [...new Set(jobsResponse.map(j => j.cityName))];
                let regionsResponse = [...new Set(jobsResponse.map(j => j.regionName))];
                let countriesResponse = [...new Set(jobsResponse.map(j => j.countryName))];
                let filtersJobs = {...filters}
                filtersJobs.cityName = citiesResponse;
                filtersJobs.countryName = countriesResponse;
                filtersJobs.regionName = regionsResponse;
                setFilters(filtersJobs)
                setJobs(jobsResponse)
                setCities(citiesResponse)
                setRegions(regionsResponse)
                setCountries(countriesResponse)
                setFilteredJobs(jobsResponse)
            })
            .catch(error => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('job_list_err'),
                    intent: Intent.DANGER,
                });
            });
    }

    /**
     * Return true if the job is posted in the selected time, false otherwise
     * @param {string} filtersDate
     * @param {string} jobDate
     */
    const filterByDate = (filtersDate, jobDate) =>  {
        // Anytime
        if (filtersDate === possibleDates[0]) {
            return true
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
    }

    /**
     * Handle filters reset
     */
    const handleFilterReset = () => {
        let citiesResponse = [...new Set(jobs.map(j => j.cityName))];
        let regionsResponse = [...new Set(jobs.map(j => j.regionName))];
        let countriesResponse = [...new Set(jobs.map(j => j.countryName))];
        setFilters({
            contractType: possibleContractType,
            employmentRegime: possibleRegimeEmp,
            experience: possibleExperiences,
            industry: defaultIndustry,
            workMode: possibleWorkMode,
            cityName: citiesResponse,
            regionName: regionsResponse,
            countryName: countriesResponse,
            postingDate: possibleDates[0],
        })
    }

    /**
     * Handle contract type change
     * @param {string} newValue
     */
    const handleContractTypeChange = (newValue) => {
        let allFilters = {...filters}
        let filterContractType = [...allFilters.contractType]
        let index = filterContractType.findIndex(ct => ct === newValue)
        if(index === -1){
            // A contract type filter is added
            filterContractType.push(newValue)
        }
        else{
            // A contract type filter is deleted
            filterContractType.splice(index, 1);
        }
        allFilters.contractType = filterContractType
        setFilters(allFilters);
    };

    /**
     * Handle employment regime change
     * @param {string} newValue
     */
    const handleRegimeChange = (newValue) => {
        let allFilters = {...filters}
        let filter = [...allFilters.employmentRegime]
        let index = filter.findIndex(ct => ct === newValue)
        if(index === -1){
            // A regime type filter is added
            filter.push(newValue)
        }
        else{
            // A regime filter is deleted
            filter.splice(index, 1);
        }
        allFilters.employmentRegime = filter
        setFilters(allFilters);
    };

    /**
     * Handle experiences change
     * @param {string} newValue
     */
    const handleExpChange = (newValue) => {
        let allFilters = {...filters}
        let filter = [...allFilters.experience]
        let index = filter.findIndex(ct => ct === newValue)
        if(index === -1){
            filter.push(newValue)
        }
        else{
            filter.splice(index, 1);
        }
        allFilters.experience = filter
        setFilters(allFilters);
    };

    /**
     * Handle work mode change
     * @param {string} newValue
     */
    const handleWorkModeChange = (newValue) => {
        let allFilters = {...filters}
        let filter = [...allFilters.workMode]
        let index = filter.findIndex(ct => ct === newValue)
        if(index === -1){
            filter.push(newValue)
        }
        else{
            filter.splice(index, 1);
        }
        allFilters.workMode = filter
        setFilters(allFilters);
    };

    /**
     * Handle industry change
     * @param {string} newValue
     */
    const handleIndustryChange = (newValue) => {
        let allFilters = {...filters}
        allFilters.industry = newValue
        setFilters(allFilters);
    };

    /**
     * Handle city change
     * @param {string} newValue
     */
    const handleCityChange = (newValue) => {
        let allFilters = {...filters}
        let filter = [...allFilters.cityName]
        let index = filter.findIndex(ct => ct === newValue)
        if(index === -1){
            filter.push(newValue)
        }
        else{
            filter.splice(index, 1);
        }
        allFilters.cityName = filter
        setFilters(allFilters);
    };

    /**
     * Handle region change
     * @param {string} newValue
     */
    const handleRegionChange = (newValue) => {
        let allFilters = {...filters}
        let filter = [...allFilters.regionName]
        let index = filter.findIndex(ct => ct === newValue)
        if(index === -1){
            filter.push(newValue)
        }
        else{
            filter.splice(index, 1);
        }
        allFilters.regionName = filter
        setFilters(allFilters);
    };

    /**
     * Handle country change
     * @param {string} newValue
     */
    const handleCountryChange = (newValue) => {
        let allFilters = {...filters}
        let filter = [...allFilters.countryName]
        let index = filter.findIndex(ct => ct === newValue)
        if(index === -1){
            filter.push(newValue)
        }
        else{
            filter.splice(index, 1);
        }
        allFilters.countryName = filter
        setFilters(allFilters);
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
     * Methods used for viewing a job
     */
    const viewJob = (job) =>{
        dispatch(setJobData(job));
        navigate("/viewJob")
    }

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

    const handleDateSelect = (selectedDate) => {
        let index = date.findIndex(i => i === selectedDate)
        if(index > -1){
            handleDateChange(possibleDates[index])
        }
    };

    /**
     * Changes the page and calculates jobs for the current page
     * @param filteredJobsList
     * @param pageNumber
     */
    const paginate = (filteredJobsList, pageNumber) => {
        const indexOfLastJob = pageNumber * jobsPerPage;
        const indexOfFirstJob = indexOfLastJob - jobsPerPage;
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

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);


    return (
        <div>
            <HeaderPage/>
            <div className={"jobs-component"}>
                <div className="filter-section">
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
                    <FormGroup label={t('posting_date')} className={`jobs-contractType-filter ${Classes.FIXED}`}>
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
                    <FormGroup label={t('contract_type')} className={`jobs-contractType-filter ${Classes.FIXED}`}>
                        <div className="job-checkbox-container">
                            {contracts.map((contractType, index) =>
                                <Checkbox
                                    className="job-checkbox-item"
                                    label={contractType}
                                    checked={filters.contractType.includes(possibleContractType[index])}
                                    onChange={() => handleContractTypeChange(possibleContractType[index])}
                                />
                            )}
                        </div>
                    </FormGroup>
                    <FormGroup label={t('employment_regime')} className={`jobs-contractType-filter ${Classes.FIXED}`}>
                        <div className="job-checkbox-container">
                            {regimes.map((regime, index) =>
                                <Checkbox
                                    className="job-checkbox-item"
                                    label={regime}
                                    checked={filters.employmentRegime.includes(possibleRegimeEmp[index])}
                                    onChange={() => handleRegimeChange(possibleRegimeEmp[index])}
                                />
                            )}
                        </div>
                    </FormGroup>
                    <FormGroup label={t('experience')} className={`jobs-contractType-filter ${Classes.FIXED}`}>
                        <div className="job-checkbox-container">
                            {experiences.map((obj, index) =>
                                <Checkbox
                                    className="job-checkbox-item"
                                    label={obj}
                                    checked={filters.experience.includes(possibleExperiences[index])}
                                    onChange={() => handleExpChange(possibleExperiences[index])}
                                />
                            )}
                        </div>
                    </FormGroup>
                    <FormGroup label={t('work_mode')} className={`jobs-contractType-filter ${Classes.FIXED}`}>
                        <div className="job-checkbox-container">
                            {works.map((obj, index) =>
                                <Checkbox
                                    className="job-checkbox-item"
                                    label={obj}
                                    checked={filters.workMode.includes(possibleWorkMode[index])}
                                    onChange={() => handleWorkModeChange(possibleWorkMode[index])}
                                />
                            )}
                        </div>
                    </FormGroup>
                    <FormGroup label={t('industry')} className={`jobs-contractType-filter ${Classes.FIXED}`}>
                        <Select items={industries}
                                fill={true}
                                matchTargetWidth={true}
                                filterable={true}
                                itemRenderer={renderDateType}
                                itemPredicate={filterIndustries}
                                onItemSelect={(e) => handleIndustryChange(industriesRo.find(d => d === e))}
                                popoverProps={{position: Position.BOTTOM}}
                        >
                            <Button text={industries[industriesRo.findIndex(d => d === filters.industry)]}
                                    rightIcon="double-caret-vertical"
                                    fill={true}/>
                        </Select>
                    </FormGroup>
                    <FormGroup label={t('city')} className={`jobs-contractType-filter ${Classes.FIXED}`}>
                        {cities.length > 0 ?
                            <div className="job-checkbox-container">
                                {cities.map((obj, index) =>
                                    <Checkbox
                                        className="job-checkbox-item"
                                        label={obj}
                                        checked={filters.cityName.includes(cities[index])}
                                        onChange={() => handleCityChange(cities[index])}
                                    />
                                )}
                            </div> :
                            <div className="no-job-filter">{t('no_job_city')}</div>
                        }
                    </FormGroup>
                    <FormGroup label={t('region')} className={`jobs-contractType-filter ${Classes.FIXED}`}>
                        {regions.length > 0 ?
                            <div className="job-checkbox-container">
                                {regions.map((obj, index) =>
                                    <Checkbox
                                        className="job-checkbox-item"
                                        label={obj}
                                        checked={filters.regionName.includes(regions[index])}
                                        onChange={() => handleRegionChange(regions[index])}
                                    />
                                )}
                            </div> :
                            <div className="no-job-filter">{t('no_job_region')}</div>
                        }
                    </FormGroup>
                    <FormGroup label={t('country')} className={`jobs-contractType-filter ${Classes.FIXED}`}>
                        {regions.length > 0 ?
                            <div className="job-checkbox-container">
                                {countries.map((obj, index) =>
                                    <Checkbox
                                        className="job-checkbox-item"
                                        label={obj}
                                        checked={filters.countryName.includes(countries[index])}
                                        onChange={() => handleCountryChange(countries[index])}
                                    />
                                )}
                            </div> :
                            <div className="no-job-filter">{t('no_job_country')}</div>
                        }
                    </FormGroup>
                </div>
                <div className={"right-section"}>
                    <div className={"job-page-buttons"}>
                        <div className="job-page-second-line-buttons">
                            <InputGroup
                                disabled={false}
                                placeholder={t('search_by_title')}
                                type="search"
                                onChange={(e)=> handleSearchChange(e.target.value)}
                            />
                            <Tooltip className="sort-jobs-tooltip" content={orderByPostDate === 0 ? t('sort_job_asc') : t('sort_job_desc')} position="bottom-left">
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
                    <div className={currentJobs.length > 0 ? "jobs-list" : "jobs-non-ideal"}>
                        {currentJobs.length > 0 ? (
                            <div className="jobs-list-show">
                                <div className="just-jobs">
                                    {currentJobs.map(job => (
                                        <div className="job-item" key={job.id}>
                                            <div className="jobs-company-logo">
                                                {job.employerProfile.imagine ?
                                                    <img className="job-profile-image" src={`data:image/jpeg;base64,${job.employerProfile.imagine}`}
                                                         alt="Company Logo"/>
                                                    :
                                                    <img className="job-profile-image" src={Image} alt="Company Logo"/>}
                                            </div>
                                            <div className="job-details">
                                                <div className="jobs-detail-text">
                                                    <div className="jobs-detail">
                                                        <div
                                                            className="job-text-date">{formatDate(job.postingDate)}</div>
                                                    </div>
                                                    <div className="jobs-detail">
                                                        <div className="job-text-title" onClick={() => {
                                                            viewJob(job)
                                                        }}>{job.title}</div>
                                                    </div>
                                                    <div className="jobs-detail">
                                                        <div className="job-text-company" >{t('company_name')}: {job.employer.companyName}</div>
                                                    </div>
                                                    <div className="jobs-detail">
                                                        <Icon icon="route" className="icon"/>
                                                        <div
                                                            className="job-text">{job.cityName}, {job.regionName}, {job.countryName}</div>
                                                    </div>
                                                    <div className="jobs-detail">
                                                        <Icon icon="application" className="icon"/>
                                                        <div
                                                            className="job-text">{experiences[possibleExperiences.findIndex(i => i === job.experience)]}</div>
                                                    </div>
                                                    <div className="jobs-detail">
                                                        <Icon icon="globe-network" className="icon"/>
                                                        <div
                                                            className="job-text">{industries[industriesRo.findIndex(i => i === job.industry)]}</div>
                                                    </div>
                                                </div>
                                                <Tooltip className="show-job-tooltip" content={t('see_more_about_job')}
                                                         position="bottom-left">
                                                    <Button
                                                        className="show-job-button"
                                                        onClick={()=>{viewJob(job)}}
                                                        small
                                                        minimal
                                                        rightIcon={<Icon size={13} icon="layout-sorted-clusters" color="black"/>}
                                                    >{t('see_more')}</Button>
                                                </Tooltip>
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
                                                    onClick={() => paginate(filteredJobs, i + 1)}
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
                                title={t('no_jobs_found')}
                                description={t('no_jobs_explanation')}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobsPage;
