import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { Chart as ChartJS, registerables } from 'chart.js';
import ChartService from "../../../services/chart.service";
import {AppToaster} from "../../common/AppToaster";
import {Intent} from "@blueprintjs/core";
import {useTranslation} from "react-i18next";
import {industriesRo} from "../../job/JobsPage";

ChartJS.register(...registerables);

const TopEmployersChart = () => {
    const { t } = useTranslation();

    const [data, setData] = useState({
        labels: [],
        datasets: [{
            label: '',
            backgroundColor: '',
            borderColor: '',
            borderWidth: 0,
            data: [],
        }],
    });
    const [dataValues, setDataValues] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        ChartService.getTopEmployersWithApplications().then((response) => {
            const topEmployersWithApplicationsCount = response.data;

            // Convert the list of Map objects to a Chart.js compatible configuration
            const labels = Object.keys(topEmployersWithApplicationsCount);
            const applicationsCount = Object.values(topEmployersWithApplicationsCount);

            // Setting up the data for the chart
            const chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Numărul de aplicații',
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
                        hoverBorderColor: 'rgba(75,192,192,1)',
                        data: applicationsCount,
                    },
                ],
            };
            setData(chartData);
            setDataValues(applicationsCount)
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('chart_err'),
                intent: Intent.DANGER,
            });
        });

    };

    let labelsTranslate = data?.labels
    let datasetLabelTranslate = t('app_number')
    const dataTranslate = {
        labels: labelsTranslate,
        datasets: [
            {
                label:  datasetLabelTranslate,
                backgroundColor: '#a8ae87',
                borderColor: '#3b3b3b',
                borderWidth: 1,
                data: dataValues,
            },
        ],
    }

    const handleScroll = (event) => {
        event.stopPropagation();
    };

    return (
        <div className="activity-chart-long">
            <div className="activity-chart-title">{t('top_employer_title')}</div>
            <div className="activity-chart-desc">{t('top_employer_title_desc')}</div>
            <div className="activity-chart-display-container">
                <div className="activity-chart-display-long">
                    {data && (
                        <Bar onScroll={handleScroll}
                             data={dataTranslate}
                             options={{
                                 responsive: true,
                                 maintainAspectRatio: true,
                                 scales: {
                                     y: {
                                         beginAtZero: true,
                                     },
                                 },
                                 legend: {
                                     position: 'top',
                                     labels: {
                                         usePointStyle: true,
                                         pointStyle: 'circle'
                                     }
                                 }
                             }}

                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopEmployersChart;
