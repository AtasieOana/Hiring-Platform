import React from "react";
import "./Activities.css";
import OverviewComponent from "./components/OverviewComponent";
import HeaderAdmin from "../../header/HeaderAdmin";
import JobExperienceComponent from "./components/JobExperienceComponent";
import JobCategoryComponent from "./components/JobCategoryComponent";
import ApplicationStatusComponent from "./components/ApplicationStatusComponent";
import TopEmployersComponent from "./components/TopEmployersComponent";
import AccountCreationComponent from "./components/AccountCreationComponent";
import ApplicationTimelineComponent from "./components/ApplicationTimelineComponent";

const ActivitiesPage = () => {
  return (
    <div className="activities-container">
      <HeaderAdmin />
      <OverviewComponent />
      <div className="activities-charts-first-line">
        <div className="activities-doughnut-bar-container">
          <JobExperienceComponent />
          <ApplicationStatusComponent />
        </div>
        <JobCategoryComponent />
      </div>
      <div className="activities-charts-second-line">
        <AccountCreationComponent />
      </div>
      <div className="activities-charts-third-line">
        <TopEmployersComponent />
        <ApplicationTimelineComponent />
      </div>
    </div>
  );
};

export default ActivitiesPage;
