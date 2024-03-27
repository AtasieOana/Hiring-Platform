import React from 'react';
import '../styles/About.css';
import Image from "../../resources-photo/HomeImg.svg";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeaderAuth from "../header/HeaderAuth";
import {PRINCIPAL_ADMIN_EMAIL} from "../../util/constants";
import {Icon} from "@blueprintjs/core";

const AboutPage = () => {

    const { t } = useTranslation()

    return (
        <div>
            <HeaderAuth/>
            <div className="container">
                <div className="left-side">
                    <img src={Image} alt="CV" />
                </div>
                <div className="right-side">
                    <div className="title">{t('home_title')}</div>
                    <div className="description">
                        <p> {t('home_desc_introduction')} <span
                            className="description-imp">Joblistic</span> {t('home_desc_next')}</p>
                        <p><span className="description-imp">{t('home_emps')}</span>, {t('home_desc_emp')}</p>
                        <p>
                            <span className="description-imp">{t('home_candidates')}</span>, {t('home_desc_candidate')}
                        </p>
                    </div>
                    <div className="cta">
                        <Link to="register">
                            {t('home_go_to_register')} &#8594;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
