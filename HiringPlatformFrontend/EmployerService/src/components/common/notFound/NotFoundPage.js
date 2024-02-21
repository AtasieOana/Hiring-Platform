import React from 'react';
import './NotFoundPage.css';
import {useTranslation} from "react-i18next";

const NotFoundPage = () => {

    const {t} = useTranslation();

    return (
        <div className="error404">
            <p className="title">{t('error_404_title')}</p>
            <span id="error">
                <span>
                    <p>{t('error_message')}</p>
                    <p>{t('possible_reasons')}</p>
                    <ul id="reasons">
                        <li>{t('reason_1')}</li>
                        <li>{t('reason_2')}</li>
                        <li>{t('reason_3')}</li>
                    </ul>
                </span>
            </span>
        </div>
    );
};

export default NotFoundPage;
