import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import ChartService from "../../../services/chart.service";
import {AppToaster} from "../../common/AppToaster";
import {Intent} from "@blueprintjs/core";
import {useTranslation} from "react-i18next";
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const JobExperienceChart = () => {
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
        ChartService.getJobsExperiencePercentage().then((response) => {
            const experiencePercentage = response.data;
            const labels = Object.keys(experiencePercentage);
            const dataValues = Object.values(experiencePercentage).map(value => parseFloat(value.toFixed(2)));
            setData({
                labels: labels,
                datasets: [
                    {
                        label: 'Procentul de job-uri',
                        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                        borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 1,
                        data: dataValues,
                    },
                ],
            });
            setDataValues(dataValues)
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('chart_err'),
                intent: Intent.DANGER,
            });
        });
    };

    let labelsTranslate = data?.labels?.map(label =>{
        if(label === "Junior"){
            return "Junior"
        }
        if(label === "Intermediar"){
            return t('intermediar')
        }
        if(label === "Entry-Level"){
            return "Entry-Level"
        }
    })
    let datasetLabelTranslate = t('job_percentage')
    const dataTranslate = {
        labels: labelsTranslate,
        datasets: [
            {
                label:  datasetLabelTranslate,
                backgroundColor: ['#f9cbc1', '#a8ae87', '#f9d572'],
                borderColor: '#3b3b3b',
                borderWidth: 1,
                data: dataValues,
            },
        ],
    }

    return (
        <div className="activity-chart">
            <div className="activity-chart-title">{t('job_exp_chart_title')}</div>
            <div className="activity-chart-desc">{t('job_exp_chart_desc')}</div>
            <div className="activity-chart-display-container">
                <div className="activity-chart-display">
                    <Pie
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
                </div>
            </div>
        </div>
    );
};

export default JobExperienceChart;
