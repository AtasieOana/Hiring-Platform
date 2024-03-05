import React, {useEffect, useState} from 'react';
import HeaderPage from "./header/HeaderPage";
import AddJobDialog from "./job/AddJobDialog";
import {Button, Checkbox, Classes, FormGroup, Intent, NonIdealState} from "@blueprintjs/core";
import JobService from "../services/job.service";
import {AppToaster} from "./common/AppToaster";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import "./HomePage.css";

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

const possibleExperiences = ['Entry-Level', 'Junior', 'Intermediar']
const experiencesRo = ["Entry-Level (0 ani)", "Junior (0-2 ani)", "Intermediar (2-4 ani)"];
const experiencesEng = ["Entry-Level (0 years)", "Junior (0-2 years)", "Intermediary (2-4 years)"];

const possibleContractType = ['Norma intreaga', 'Norma redusa', 'Norma variabila']
const contractEn = ["Full-time", "Part-time", "Freelance"]
const contractRo = ["Full-time", "Part-time", "Variabil"]

const possibleRegimeEmp = ['Stagiu', 'Proiect', 'Contract determinat', 'Contract nedeterminat']
const regimeEn = ["Internship", "Project", "Fixed-term Contract", "Indefinite-term Contract"]
const regimeRo = ["Stagiu", "Proiect", "Contract determinat", "Contract nedeterminat"]

const possibleWorkMode = ['On-Site', 'Remote', 'Hibrid']
const workEn = ["On-Site", "Remote", "Hybrid"]
const workRo = ["La birou", "La distanță", "Hibrid"]

const HomePage = () => {

    const {t, i18n} = useTranslation();
    const employer = useSelector(state => state.auth.employer);

    const industries = i18n.language === "ro" ? industriesRo : industriesEng
    const experiences = i18n.language === "ro" ? experiencesRo : experiencesEng
    const contracts = i18n.language === "ro" ? contractRo : contractEn
    const regimes = i18n.language === "ro" ? regimeRo : regimeEn
    const works = i18n.language === "ro" ? workRo : workEn

    // States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({
        contractType: possibleContractType,
        employmentRegime: possibleRegimeEmp,
        experience: possibleExperiences,
        industry: [],
        workMode: possibleWorkMode,
        cityName: [],
        regionName: [],
        countryName: []
    });
    const [searchTerm, setSearchTerm] = useState('');

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
        // Filter by contract type
        let allJobs = [...jobs]
        console.log(filters.workMode, allJobs)
        let filtered = allJobs.filter(job =>
            filters.contractType.includes(job.contractType)
            && filters.employmentRegime.includes(job.employmentRegime)
            && filters.workMode.includes(job.workMode)
            && filters.experience.includes(job.experience))
        setFilteredJobs(filtered);
    }, [jobs, filters, searchTerm]);

    /**
     * Handle filters reset
     */
    const handleFilterReset = () => {
        setFilters({
            contractType: possibleContractType,
            employmentRegime: possibleRegimeEmp,
            experience: possibleExperiences,
            industry: [],
            workMode: possibleWorkMode,
            cityName: [],
            regionName: [],
            countryName: []
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
     * Handle employement regime change
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
     * Handle dialog action
     */
    const handleDialogAction = () => {
        setIsDialogOpen(!isDialogOpen);
    }

    /**
     * Method to retrieve job list for employer
     */
    const getJobs = () => {
        JobService.getAllJobsForEmployer(employer.employerId)
            .then((response) => {
                setJobs(response.data)
                setFilteredJobs(response.data)
            })
            .catch(error => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('job_list_err'),
                    intent: Intent.DANGER,
                });
            });
    }

    return (
        <div>
            <HeaderPage/>
            TODO: HOME PAGE FOR EMPLOYER
            <Button className="add-job-button" onClick={handleDialogAction}>
                Adauga job
            </Button>
            <div className="filter-section">
                <Button className="reset-filter-button" onClick={handleFilterReset}>
                    Reset filters
                </Button>
                <FormGroup label="Contract Type" className={`jobs-contractType-filter ${Classes.FIXED}`}>
                    {contracts.map((contractType, index) =>
                        <Checkbox
                            label={contractType}
                            checked={filters.contractType.includes(possibleContractType[index])}
                            onChange={() => handleContractTypeChange(possibleContractType[index])}
                        />
                    )}
                </FormGroup>
                <FormGroup label="Employment Regime" className={`jobs-contractType-filter ${Classes.FIXED}`}>
                    {regimes.map((regime, index) =>
                        <Checkbox
                            label={regime}
                            checked={filters.employmentRegime.includes(possibleRegimeEmp[index])}
                            onChange={() => handleRegimeChange(possibleRegimeEmp[index])}
                        />
                    )}
                </FormGroup>
                <FormGroup label="Experience" className={`jobs-contractType-filter ${Classes.FIXED}`}>
                    {experiences.map((obj, index) =>
                        <Checkbox
                            label={obj}
                            checked={filters.experience.includes(possibleExperiences[index])}
                            onChange={() => handleExpChange(possibleExperiences[index])}
                        />
                    )}
                </FormGroup>
                <FormGroup label="Work mode" className={`jobs-contractType-filter ${Classes.FIXED}`}>
                    {works.map((obj, index) =>
                        <Checkbox
                            label={obj}
                            checked={filters.workMode.includes(possibleWorkMode[index])}
                            onChange={() => handleWorkModeChange(possibleWorkMode[index])}
                        />
                    )}
                </FormGroup>
            </div>
            <div className="jobs-list">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => (
                        <div className="job-item" key={job.id}>
                            <h3>{job.title}</h3>
                            <p>{job.experience}</p>
                            <p>{job.industry}</p>
                            <p>{job.cityName}</p>
                            <p className="job-details">{job.contractType}, {job.employmentRegime}, {job.workMode}</p>
                        </div>
                    ))
                ) : (
                    <NonIdealState
                        icon="search"
                        title="No Jobs Found"
                        description="No jobs match the selected criteria."
                    />
                )}
            </div>
            <AddJobDialog isDialogOpen={isDialogOpen} handleDialogAction={handleDialogAction}/>
        </div>
    );
};

export default HomePage;
