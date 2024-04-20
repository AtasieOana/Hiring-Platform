// ActivitiesPage.js
import React, { useEffect, useState } from "react";
import { Card, Icon, Intent } from "@blueprintjs/core";
import ChartService from "../../../../services/chart.service";
import { AppToaster } from "../../../common/AppToaster";
import { useTranslation } from "react-i18next";
import { Chart, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";

Chart.register(Title);

const JobExperienceComponent = () => {
  const { t } = useTranslation();

  const [dataEntryLevel, setDataEntryLevel] = useState(0);
  const [dataJunior, setDataJunior] = useState(0);
  const [dataIntermediate, setDataIntermediate] = useState(0);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    ChartService.getJobsExperiencePercentage()
      .then((response) => {
        const experiencePercentage = response.data;
        setDataEntryLevel(experiencePercentage["Entry-Level"]);
        setDataJunior(experiencePercentage["Junior"]);
        setDataIntermediate(experiencePercentage["Intermediar"]);
      })
      .catch((error) => {
        console.error("Error: ", error.message);
        AppToaster.show({
          message: t("chart_err"),
          intent: Intent.DANGER,
        });
      });
  };

  const doughnutDataEntryLevel = {
    labels: [t("entry_level"), t("others")],
    datasets: [
      {
        data: [dataEntryLevel, 100 - dataEntryLevel], // dataEntryLevel entry level, 100 - dataEntryLevel others
        backgroundColor: ["#FF6384", "#DDDDDD"],
        hoverBackgroundColor: ["#FF6384", "#DDDDDD"],
      },
    ],
  };

  const doughnutDataIntermediate = {
    labels: [t("intermediate"), t("others")],
    datasets: [
      {
        data: [dataIntermediate, 100 - dataIntermediate], // dataIntermediate intermediate, 100 - dataIntermediate others
        backgroundColor: ["#36A2EB", "#DDDDDD"],
        hoverBackgroundColor: ["#36A2EB", "#DDDDDD"],
      },
    ],
  };

  const doughnutDataJunior = {
    labels: [t("junior"), t("others")],
    datasets: [
      {
        data: [dataJunior, 100 - dataJunior], // dataJunior junior, 100 - dataJunior others
        backgroundColor: ["#FFCE56", "#DDDDDD"],
        hoverBackgroundColor: ["#FFCE56", "#DDDDDD"],
      },
    ],
  };

  const doughnutOptionsEntryLevel = {
    maintainAspectRatio: true,
    aspectRatio: 1,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: t("entry_level_jobs"),
        font: {
          size: 13,
          family: "Helvetica Neue",
        },
      },
    },
  };
  const doughnutOptionsIntermediate = {
    maintainAspectRatio: true,
    aspectRatio: 1,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: t("intermediate_jobs"),
        font: {
          size: 13,
          family: "Helvetica Neue",
        },
      },
    },
  };
  const doughnutOptionsJunior = {
    maintainAspectRatio: false,
    aspectRatio: 1,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: t("junior_jobs"),
        font: {
          size: 13,
          family: "Helvetica Neue",
        },
      },
    },
  };

  return (
    <Card className="job-experience-container">
      <div className="job-experience-charts">
        <div className="job-experience-chart">
          <Doughnut
            data={doughnutDataEntryLevel}
            options={doughnutOptionsEntryLevel}
          />
        </div>
        <div className="job-experience-chart">
          <Doughnut data={doughnutDataJunior} options={doughnutOptionsJunior} />
        </div>
        <div className="job-experience-chart">
          <Doughnut
            data={doughnutDataIntermediate}
            options={doughnutOptionsIntermediate}
          />
        </div>
      </div>
    </Card>
  );
};

export default JobExperienceComponent;
