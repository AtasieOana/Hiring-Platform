import React from 'react';
import JobCategoryChart from "./JobCategoryChart";
import HeaderAdmin from "../../header/HeaderAdmin";
import ApplicationStatusChart from "./ApplicationStatusChart";
import ApplicationsTimelineChart from "./ApplicationsTimelineChart";
import JobExperienceChart from "./JobExperienceChart";
import TopEmployersChart from "./TopEmployersChart";
import AccountCreationChart from "./AccountCreationChart";
import "./Activities.css"

const ActivitiesPage = () =>{

    return <div>
        <HeaderAdmin/>
        <div className="chart-group">
            <ApplicationStatusChart/>
            <JobExperienceChart/>
        </div>
        <div className="chart-group">
            <JobCategoryChart/>
            <TopEmployersChart/>
        </div>
        <div className="chart-group">
            <ApplicationsTimelineChart/>
            <AccountCreationChart/>
        </div>
    </div>
}

export default ActivitiesPage;