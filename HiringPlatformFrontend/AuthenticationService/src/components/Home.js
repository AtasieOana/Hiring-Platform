// Header.js
import React from 'react';
import './styles/Home.css';
import Image from "../resources/HomeImg.png";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {

    const { t } = useTranslation()

    return (
        <div className="container">
            <div className="left-side">
                <img src={Image} alt="Home" width="400" height="400" />
            </div>
            <div className="right-side">
                <div className="title">{t('home_title')}</div>
                <div className="description">
                    <p> {t('home_desc_introduction')} <span className="description-imp">Joblistic</span> {t('home_desc_next')}</p>
                    <p> <span className="description-imp">{t('home_emps')}</span>, {t('home_desc_emp')}</p>
                    <p> <span className="description-imp">{t('home_candidates')}</span>, {t('home_desc_candidate')}</p>
                </div>
                <div className="cta">
                    <Link to="register">
                        {t('home_go_to_register')} &#8594;
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
