import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, registerables } from 'chart.js';
import ChartService from "../../../services/chart.service";
import {AppToaster} from "../../common/AppToaster";
import {Intent} from "@blueprintjs/core";
import {useTranslation} from "react-i18next";

ChartJS.register(...registerables);

const ApplicationsTimelineChart = () => {
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
        ChartService.getApplicationsPerDate().then((response) => {
            const applicationsByDate = response.data;
            // Converts the data object to an array of objects for use by the line graph
            const chartData = {
                labels: Object.keys(applicationsByDate),
                datasets: [
                    {
                        label: 'Număr de aplicații încărcate',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderCapStyle: 'round',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 2,
                        pointHitRadius: 10,
                        data: Object.values(applicationsByDate),
                    },
                ],
            };
            setData(chartData);
            setDataValues(Object.values(applicationsByDate).sort())
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
                fill: false,
                lineTension: 0.1,
                backgroundColor: '#3b3b3b',
                borderColor: '#f9d572',
                borderCapStyle: 'round',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: '#f2ad4d',
                pointBackgroundColor: '#f2ad4d',
                pointBorderWidth: 2,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#f2ad4d',
                pointHoverBorderColor: '#f2ad4d',
                pointHoverBorderWidth: 2,
                pointRadius: 2,
                pointHitRadius: 10,
                data: dataValues,
            },
        ],
    }

    return (
        <div className="activity-chart-long">
            <div className="activity-chart-title">{t('app_count_time_title')}</div>
            <div className="activity-chart-desc">{t('app_count_time_desc')}</div>
            <div className="activity-chart-display-container">
                <div className="activity-chart-display-long">
                    {data && (
                        <Line
                            data={dataTranslate}
                            options={{
                                maintainAspectRatio: true,
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                        labels: {
                                            usePointStyle: true,
                                            pointStyle: 'circle'
                                        }
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

export default ApplicationsTimelineChart;
