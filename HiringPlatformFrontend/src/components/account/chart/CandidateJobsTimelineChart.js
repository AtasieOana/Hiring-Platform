import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { Intent } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";
import CandidateService from "../../../services/candidate.service";

ChartJS.register(...registerables);

const CandidateJobsTimelineChart = () => {
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
    CandidateService.getJobsPublishedPerDay()
      .then((response) => {
        const applicationsByDate = response.data;
        // Converts the data object to an array of objects for use by the line graph
        const chartData = {
          labels: Object.keys(applicationsByDate),
          datasets: [
            {
              label: "Număr de aplicări încărcate",
              borderWidth: 1,
              backgroundColor: ["#f9cbc1"],
              borderColor: "rgba(0,0,0,1)",
              data: Object.values(applicationsByDate),
            },
          ],
        };
        setData(chartData);
        setDataValues(Object.values(applicationsByDate).sort());
      })
      .catch((error) => {
        console.error("Error: ", error.message);
      });
  };

  let labelsTranslate = data?.labels;
  let datasetLabelTranslate = t("jobs_number");
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
        {t("number_of_jobs_daily_candidates")}
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

export default CandidateJobsTimelineChart;
