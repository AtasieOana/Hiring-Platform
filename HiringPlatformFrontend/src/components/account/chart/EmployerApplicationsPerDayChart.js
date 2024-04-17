import React, { useEffect, useState } from 'react';
import {Bar} from 'react-chartjs-2';
import {AppToaster} from "../../common/AppToaster";
import {Intent} from "@blueprintjs/core";
import {useTranslation} from "react-i18next";
import { Chart as ChartJS, registerables } from 'chart.js';
import EmployerService from "../../../services/employer.service";

ChartJS.register(...registerables);

const EmployerApplicationsPerDayChart = (employerId) => {
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
        EmployerService.getAppsPerDayByEmployer(employerId.employerId).then((response) => {
            const applicationsByDate = response.data;
            // Converts the data object to an array of objects for use by the line graph
            const chartData = {
                labels: Object.keys(applicationsByDate),
                datasets: [
                    {
                        label: 'Număr de aplicații per zi',
                        borderWidth: 1,
                        backgroundColor: ['#FF6384'],
                        borderColor: 'rgba(0,0,0,1)',
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
                borderWidth: 1,
                backgroundColor: ['#a8ae87'],
                borderColor: 'rgba(0,0,0,1)',
                data: dataValues,
            },
        ],
    }

    return (
        <div className="profile-chart-container-long">
            <div className="profile-chart-title">{t('number_of_app_daily_employers')}</div>
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
                                        position: 'top',
                                        labels: {
                                            usePointStyle: true,
                                            pointStyle: 'circle'
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        grid: {
                                            display: true
                                        },
                                        ticks: {
                                            stepSize: 1
                                        }
                                    },
                                    x: {
                                        grid: {
                                            display: false // removing lines from the x-axis
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

export default EmployerApplicationsPerDayChart;
