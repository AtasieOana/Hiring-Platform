// ActivitiesPage.js
import React, { useEffect, useState } from "react";
import { Card, Icon, Intent } from "@blueprintjs/core";
import ChartService from "../../../../services/chart.service";
import { AppToaster } from "../../../common/AppToaster";
import { useTranslation } from "react-i18next";

const OverviewComponent = () => {
  const { t } = useTranslation();

  const [statsData, setStatsData] = useState({
    numberOfCandidates: 0,
    numberOfAdmins: 0,
    numberOfEmployers: 0,
    numberOfJobs: 0,
    numberOfApplications: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    ChartService.getOverview()
      .then((response) => {
        let responseChart = response.data;
        setStatsData(responseChart);
      })
      .catch((error) => {
        console.error("Error: ", error.message);
        AppToaster.show({
          message: t("overview_err"),
          intent: Intent.DANGER,
        });
      });
  };

  let stats = [
    {
      title: t("candidates"),
      value: statsData.numberOfCandidates,
      icon: "people",
    },
    {
      title: t("employers"),
      value: statsData.numberOfEmployers,
      icon: "office",
    },
    { title: t("admins"), value: statsData.numberOfAdmins, icon: "shield" },
    {
      title: t("applications"),
      value: statsData.numberOfApplications,
      icon: "document",
    },
    { title: t("jobs"), value: statsData.numberOfJobs, icon: "briefcase" },
  ];

  return (
    <div className="activities-overview">
      {stats.map((stat, index) => (
        <Card
          key={index}
          interactive={false}
          className="activities-overview-card"
        >
          <div className="activities-overview-left">
            <div className="activities-overview-value">{stat.value}</div>
            <div className="activities-overview-title">{stat.title}</div>
          </div>
          <div className="activities-overview-right">
            <Icon icon={stat.icon} size={30} />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default OverviewComponent;
