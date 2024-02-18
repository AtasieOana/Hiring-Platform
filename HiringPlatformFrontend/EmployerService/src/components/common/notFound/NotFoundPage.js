import React from 'react';
import './NotFoundPage.css';
import {useTranslation} from "react-i18next";

const NotFoundPage = () => {

    const {t} = useTranslation();

    return (
        <div className="not-found-page">
            <h1>404 - {t('notfound')}</h1>
            <p>{t('notfound2')}</p>
        </div>
    );
};

export default NotFoundPage;
