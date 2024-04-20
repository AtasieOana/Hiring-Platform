// ActivitiesPage.js
import React, { useEffect, useState } from "react";
import { Card, Icon, Intent } from "@blueprintjs/core";
import ChartService from "../../../../services/chart.service";
import { AppToaster } from "../../../common/AppToaster";
import { useTranslation } from "react-i18next";
import { Chart, Title } from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { industriesEng, industriesRo } from "../../../job/JobsPage";

Chart.register(Title);

const JobCategoryComponent = () => {
  const { t, i18n } = useTranslation();
  const industries = i18n.language === "ro" ? industriesRo : industriesEng;

  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        backgroundColor: "",
        borderColor: "",
        borderWidth: 0,
        data: [],
      },
    ],
  });
  const [dataValues, setDataValues] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    ChartService.getJobCategoryDistribution()
      .then((response) => {
        const categoryDistribution = response.data;
        const categories = Object.keys(categoryDistribution);
        const jobCounts = Object.values(categoryDistribution);
        setData({
          labels: categories,
          datasets: [
            {
              label: "Număr de joburi",
              backgroundColor: "rgba(75,192,192,1)",
              borderColor: "rgba(0,0,0,1)",
              borderWidth: 1,
              data: jobCounts,
            },
          ],
        });
        setDataValues(jobCounts);
      })
      .catch((error) => {
        console.error("Error: ", error.message);
        AppToaster.show({
          message: t("chart_err"),
          intent: Intent.DANGER,
        });
      });
  };

  let labelsTranslate = data?.labels?.map((label) => {
    return industries[industriesRo.findIndex((d) => d === label)];
  });
  let datasetLabelTranslate = t("jobs_number");
  const dataTranslate = {
    labels: labelsTranslate,
    datasets: [
      {
        label: datasetLabelTranslate,
        backgroundColor: "#f9cbc1",
        borderColor: "#3b3b3b",
        borderWidth: 1,
        data: dataValues,
      },
    ],
  };

  return (
    <Card className="activities-chart-job-category">
      <Bar
        data={dataTranslate}
        options={{
          maintainAspectRatio: false,
          aspectRatio: 2,
          responsive: true,
          ticks: {
            min: 0,
            stepSize: 1,
          },
          scales: { xAxes: [{ display: false }], yAxes: [{ display: false }] },
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: t("job_distribution_title"),
              font: {
                size: 20,
                family: "Helvetica Neue",
              },
            },
          },
        }}
      />
    </Card>
  );
};

export default JobCategoryComponent;
