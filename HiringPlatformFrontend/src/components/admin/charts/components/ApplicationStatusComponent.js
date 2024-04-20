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

const ApplicationStatusComponent = () => {
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
    ChartService.getApplicationStatusPercentage()
      .then((response) => {
        const statusPercentage = response.data;
        const labels = Object.keys(statusPercentage);
        const dataValues = Object.values(statusPercentage).map((value) =>
          parseFloat(value.toFixed(2)),
        );
        setData({
          labels: labels,
          datasets: [
            {
              label: "Procentul de aplicări",
              backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
              borderColor: "rgba(0,0,0,1)",
              borderWidth: 1,
              data: dataValues,
            },
          ],
        });
        setDataValues(dataValues);
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
    if (label === "in_curs") {
      return t("in_curs");
    }
    if (label === "finalizat") {
      return t("finalizat");
    }
    if (label === "refuzat") {
      return t("refuzat");
    }
  });
  let datasetLabelTranslate = t("app_number");
  const dataTranslate = {
    labels: labelsTranslate,
    datasets: [
      {
        label: datasetLabelTranslate,
        backgroundColor: ["#66d591", "#e072b6", "#f9d572"],
        borderColor: "#3b3b3b",
        borderWidth: 1,
        data: dataValues,
      },
    ],
  };

  return (
    <Card className="activities-app-status">
      <Bar
        data={dataTranslate}
        options={{
          maintainAspectRatio: false,
          aspectRatio: 2,
          responsive: true,
          indexAxis: "y",
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
              text: t("app_status_chart_title"),
              font: {
                size: 16,
                family: "Helvetica Neue",
              },
            },
          },
          scales: {
            xAxes: [
              {
                barThickness: 5,
              },
            ],
          },
        }}
      />
    </Card>
  );
};

export default ApplicationStatusComponent;
