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

const AccountCreationComponent = () => {
  const { t } = useTranslation();

  const roleColors = {
    ROLE_ADMIN: "#f9cbc1",
    ROLE_EMPLOYER: "#a8ae87",
    ROLE_CANDIDATE: "#f9d572",
  };
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
  const [dataLabel, setDataLabel] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const processData = (dataSend) => {
    const roles = Object.keys(dataSend);
    let distinctDates = [];
    roles.forEach((role) => {
      const dates = Object.keys(dataSend[role]);
      distinctDates = distinctDates.concat(
        dates.filter((date) => !distinctDates.includes(date)),
      );
    });
    let allDates = distinctDates.sort();
    let formatted = {
      labels: allDates,
      datasets: roles.map((role) => ({
        label: role,
        data: allDates.map((date) => {
          return dataSend[role][date] !== undefined ? dataSend[role][date] : 0;
        }),
        fill: false,
        borderColor: roleColors[role],
        backgroundColor: roleColors[role],
      })),
    };

    setDataValues(formatted.datasets);
    return formatted;
  };

  const fetchData = () => {
    ChartService.getAccountCreationTrend()
      .then((response) => {
        const responseChart = response.data;
        const chartData = processData(responseChart);
        setData(chartData);
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
  let datasetTranslate = dataValues.map((data) => {
    let role = data.label;
    let labelRole = data.label;
    if (role === ADMIN_ACCOUNT) {
      labelRole = t("admin");
    }
    if (role === CANDIDATE_ACCOUNT) {
      labelRole = t("candidate_label");
    }
    if (role === EMPLOYER_ACCOUNT) {
      labelRole = t("employer_label");
    }
    return {
      label: labelRole,
      data: data.data,
      fill: false,
      borderColor: roleColors[role],
      backgroundColor: roleColors[role],
    };
  });
  const dataTranslate = {
    labels: labelsTranslate,
    datasets: datasetTranslate,
  };

  return (
    <Card className="activities-chart-account-creation">
      <Line
        data={dataTranslate}
        options={{
          maintainAspectRatio: false,
          aspectRatio: 2,
          responsive: true,
          plugins: {
            legend: {
              position: "top",
              labels: {
                usePointStyle: true,
                pointStyle: "circle",
              },
            },
            title: {
              display: true,
              text: t("acc_count_time_title"),
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

export default AccountCreationComponent;
