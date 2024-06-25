import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { AppToaster } from "../../common/AppToaster";
import { Intent } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";
import { Chart as ChartJS, registerables } from "chart.js";
import EmployerService from "../../../services/employer.service";

ChartJS.register(...registerables);

const EmployerApplicationsPerJobChart = (employerId) => {
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
    EmployerService.getAppsPerJobByEmployer(employerId.employerId)
      .then((response) => {
        const applicationsByJob = response.data;
        // Converts the data object to an array of objects for use by the line graph
        const chartData = {
          labels: Object.keys(applicationsByJob),
          datasets: [
            {
              label: "Număr de aplicări per job",
              borderWidth: 1,
              backgroundColor: ["#FF6384"],
              borderColor: "rgba(0,0,0,1)",
              data: Object.values(applicationsByJob),
            },
          ],
        };
        setData(chartData);
        setDataValues(Object.values(applicationsByJob).sort());
      })
      .catch((error) => {
        console.error("Error: ", error.message);
      });
  };

  let labelsTranslate = data?.labels;
  let datasetLabelTranslate = t("app_number");
  const dataTranslate = {
    labels: labelsTranslate,
    datasets: [
      {
        label: datasetLabelTranslate,
        borderWidth: 1,
        backgroundColor: ["#f9cbc1"],
        borderColor: "rgba(0,0,0,1)",
        data: dataValues,
      },
    ],
  };

  return (
    <div className="profile-chart-container-long">
      <div className="profile-chart-title">
        {t("number_of_app_per_job_employers")}
      </div>
      <div className="profile-chart">
        <div className="profile-chart-content">
          {data && (
            <Bar
              data={dataTranslate}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      usePointStyle: true,
                      pointStyle: "circle",
                    },
                  },
                },
                tooltips: {
                  enabled: true,
                  mode: "label",
                },
                scales: {
                  y: {
                    grid: {
                      display: true,
                    },
                    ticks: {
                      stepSize: 1,
                    },
                  },
                  x: {
                    grid: {
                      display: false, // removing lines from the x-axis
                    },
                    ticks: {
                      callback: function (value) {
                        // truncate the labels only in this axis
                        const lbl = this.getLabelForValue(Number(value));
                        if (typeof lbl === "string" && lbl.length > 13) {
                          return `${lbl.substring(0, 13)}...`;
                        }
                        return lbl;
                      },
                    },
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerApplicationsPerJobChart;
