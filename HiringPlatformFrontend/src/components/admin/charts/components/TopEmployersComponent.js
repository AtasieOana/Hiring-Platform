// ActivitiesPage.js
import React, { useEffect, useState } from "react";
import { Card, Intent } from "@blueprintjs/core";
import ChartService from "../../../../services/chart.service";
import { AppToaster } from "../../../common/AppToaster";
import { useTranslation } from "react-i18next";
import { Chart, Title } from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(Title);

const TopEmployersComponent = () => {
  const { t } = useTranslation();
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
    ChartService.getTopEmployersWithApplications()
      .then((response) => {
        const topEmployersWithApplicationsCount = response.data;

        // Convert the list of Map objects to a Chart.js compatible configuration
        const labels = Object.keys(topEmployersWithApplicationsCount);
        const applicationsCount = Object.values(
          topEmployersWithApplicationsCount,
        );

        // Setting up the data for the chart
        const chartData = {
          labels: labels,
          datasets: [
            {
              label: "Numărul de aplicații",
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 1,
              hoverBackgroundColor: "rgba(75,192,192,0.6)",
              hoverBorderColor: "rgba(75,192,192,1)",
              data: applicationsCount,
            },
          ],
        };
        setData(chartData);
        setDataValues(applicationsCount);
      })
      .catch((error) => {
        console.error("Error: ", error.message);
        AppToaster.show({
          message: t("chart_err"),
          intent: Intent.DANGER,
        });
      });
  };

  let labelsTranslate = data?.labels;
  let datasetLabelTranslate = t("app_number");
  const dataTranslate = {
    labels: labelsTranslate,
    datasets: [
      {
        label: datasetLabelTranslate,
        backgroundColor: "#a8ae87",
        borderColor: "#3b3b3b",
        borderWidth: 1,
        data: dataValues,
      },
    ],
  };

  return (
    <Card className="activities-chart-top-employees">
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
              text: t("top_employer_title"),
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

export default TopEmployersComponent;
