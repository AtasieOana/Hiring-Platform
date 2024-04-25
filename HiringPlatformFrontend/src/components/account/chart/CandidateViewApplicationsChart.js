import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { AppToaster } from "../../common/AppToaster";
import { Intent } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";
import { Chart as ChartJS, registerables } from "chart.js";
import CandidateService from "../../../services/candidate.service";

ChartJS.register(...registerables);

const CandidateApplicationViewChart = (candidateId) => {
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
    CandidateService.getApplicationViewedNumbers(candidateId.candidateId)
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
              label: "Numarul de CV-uri",
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
      });
  };

  let labelsTranslate = data?.labels?.map((label) => {
    if (label === "vazut") {
      return t("app_viewed");
    }
    if (label === "nevazut") {
      return t("app_not_viewed");
    }
  });
  let datasetLabelTranslate = t("app_number");
  const dataTranslate = {
    labels: labelsTranslate,
    datasets: [
      {
        label: datasetLabelTranslate,
        backgroundColor: ["#f9cbc1", "#a8ae87"],
        borderColor: "#3b3b3b",
        borderWidth: 1,
        data: dataValues,
      },
    ],
  };

  return (
    <div className="profile-chart-container">
      <div className="profile-chart-title">
        {t("number_of_app_view_candidates")}
      </div>
      <div className="profile-chart">
        <div className="profile-chart-content">
          <Doughnut
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
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CandidateApplicationViewChart;
