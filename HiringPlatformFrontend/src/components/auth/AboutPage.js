import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Icon } from "@blueprintjs/core";
import HeaderAuth from "../header/HeaderAuth";
import Image from "../../resources-photo/AboutPageImg.png";
import "../styles/About.css";

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <HeaderAuth />
      <section className="about-main-section">
        <div className="about-container">
          <div className="about-text">
            <div>
              <div className="about-us-title">{t("about_us_title")}</div>
              <div className="about-motto">{t("about_us_motto")}</div>
              <div className="about-description">{t("about_us_desc")}</div>
              <div className="about-cta">
                <Link to="register" className="about-register-button">
                  {t("home_go_to_register")} <Icon icon="arrow-right" />
                </Link>
              </div>
            </div>
            <div className="about-image">
              <img src={Image} alt="CV" />
            </div>
          </div>
        </div>
      </section>
      <section className="about-secondary-section">
        <div className="about-container">
          <div className="about-secondary-text">
            <div className="about-us-subtitle">{t("what_we_offer")}</div>
            <div className="about-secondary-short">{t("what_we_offer1")}</div>
          </div>
          <div className="about-secondary-description">
            <div>
              <div>{t("about_us_point_one")}</div>
              <div>{t("about_us_point_two")}</div>
            </div>
            <div>
              <div>{t("about_us_point_three")}</div>
              <div>{t("about_us_point_four")}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
