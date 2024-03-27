import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { AppToaster } from "../../common/AppToaster";
import { Intent } from "@blueprintjs/core";
import ChartService from "../../../services/chart.service";
import { useTranslation } from "react-i18next";
import { Chart as ChartJS, registerables } from 'chart.js';
import {industriesEng, industriesRo} from "../../job/JobsPage";
ChartJS.register(...registerables);

const JobCategoryChart = () => {
    const { t, i18n } = useTranslation();
    const industries = i18n.language === "ro" ? industriesRo : industriesEng

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
        ChartService.getJobCategoryDistribution().then((response) => {
            const categoryDistribution = response.data;
            const categories = Object.keys(categoryDistribution);
            const jobCounts = Object.values(categoryDistribution);
            setData({
                labels: categories,
                datasets: [
                    {
                        label: 'Număr de joburi',
                        backgroundColor: 'rgba(75,192,192,1)',
                        borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 1,
                        data: jobCounts,
                    },
                ],
            });
            setDataValues(jobCounts)
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('chart_err'),
                intent: Intent.DANGER,
            });
        });
    };

    let labelsTranslate = data?.labels?.map(label =>{
        return industries[industriesRo.findIndex(d => d === label)]
    })
    let datasetLabelTranslate = t('jobs_number')
    const dataTranslate = {
        labels: labelsTranslate,
        datasets: [
            {
                label:  datasetLabelTranslate,
                backgroundColor: '#f9cbc1',
                borderColor: '#3b3b3b',
                borderWidth: 1,
                data: dataValues,
            },
        ],
    }

    return (
        <div className="activity-chart-long chart-background-small">
            <div className="activity-chart-title">{t('job_distribution_title')}</div>
            <div className="activity-chart-desc">{t('job_distribution_desc')}</div>
            <div className="activity-chart-display-container">
                <div className="activity-chart-display-long">
                    <Bar
                        data={dataTranslate}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            legend: {
                                position: 'top',
                                labels: {
                                    usePointStyle: true,
                                    pointStyle: 'circle'
                                }
                            }
                        }}
                />
                </div>
            </div>
        </div>
    );
};

export default JobCategoryChart;
