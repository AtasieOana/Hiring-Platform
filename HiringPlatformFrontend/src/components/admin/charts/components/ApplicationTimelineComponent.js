// ActivitiesPage.js
import React, { useEffect, useState } from "react";
import { Card, Icon, Intent } from "@blueprintjs/core";
import ChartService from "../../../../services/chart.service";
import { AppToaster } from "../../../common/AppToaster";
import { useTranslation } from "react-i18next";
import { Chart, Title } from "chart.js";
import { Line } from "react-chartjs-2";
import {
  ADMIN_ACCOUNT,
  CANDIDATE_ACCOUNT,
  EMPLOYER_ACCOUNT,
} from "../../../../util/constants";

Chart.register(Title);

const ApplicationTimelineComponent = () => {
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
    ChartService.getApplicationsPerDate()
      .then((response) => {
        const applicationsByDate = response.data;
        // Converts the data object to an array of objects for use by the line graph
        const chartData = {
          labels: Object.keys(applicationsByDate),
          datasets: [
            {
              label: "Număr de aplicări încărcate",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: "round",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 2,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 2,
              pointHitRadius: 10,
              data: Object.values(applicationsByDate),
            },
          ],
        };
        setData(chartData);
        setDataValues(Object.values(applicationsByDate).sort());
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
        fill: false,
        lineTension: 0.1,
        backgroundColor: "#3b3b3b",
        borderColor: "#f9d572",
        borderCapStyle: "round",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#f2ad4d",
        pointBackgroundColor: "#f2ad4d",
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#f2ad4d",
        pointHoverBorderColor: "#f2ad4d",
        pointHoverBorderWidth: 2,
        pointRadius: 2,
        pointHitRadius: 10,
        data: dataValues,
      },
    ],
  };

  return (
    <Card className="activities-chart-app-timeline">
      <Line
        data={dataTranslate}
        options={{
          maintainAspectRatio: false,
          aspectRatio: 2,
          responsive: true,
          ticks: {
            min: 0,
            stepSize: 1,
          },
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: t("app_count_time_title"),
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

export default ApplicationTimelineComponent;
