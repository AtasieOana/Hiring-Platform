import React, { useState, useEffect } from "react";
import { Card, Elevation, Icon, Intent } from "@blueprintjs/core";
import "./Contact.css";
import AdminService from "../../services/admin.service";
import { AppToaster } from "../common/AppToaster";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import HeaderWithoutCV from "../header/HeaderPageWithoutCV";
import HeaderPageCandidate from "../header/HeaderPageCandidate";
import HeaderWithoutProfile from "../header/HeaderPageWithoutProfile";
import HeaderPageEmployer from "../header/HeaderPageEmployer";
import HeaderAdmin from "../header/HeaderAdmin";
import HeaderPage from "../header/HeaderAuth";
import { PRINCIPAL_ADMIN_EMAIL } from "../../util/constants";

const ContactPage = () => {
  const { t } = useTranslation();

  const hasCv = useSelector((state) => state.cv.hasCv);
  const candidate = useSelector((state) => state.auth.candidate);
  const employer = useSelector((state) => state.auth.employer);
  const hasProfile = useSelector((state) => state.profile.hasProfile);
  const isAuthenticatedAdmin = useSelector(
    (state) => state.admin.isAuthenticated,
  );

  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    // Request admin list from backend
    AdminService.getAllAdmins()
      .then((response) => {
        setAdmins(response.data);
      })
      .catch((error) => {
        console.log("Error: ", error.message);
        AppToaster.show({
          message: t("retrieve_admin_err"),
          intent: Intent.DANGER,
        });
      });
  }, []);

  const chooseHeader = () => {
    if (candidate && candidate.candidateId !== "") {
      if (!hasCv) {
        return <HeaderWithoutCV />;
      } else {
        return <HeaderPageCandidate />;
      }
    }
    if (employer && employer.employerId !== "") {
      if (!hasProfile) {
        return <HeaderWithoutProfile />;
      } else {
        return <HeaderPageEmployer />;
      }
    }
    if (isAuthenticatedAdmin) {
      return <HeaderAdmin />;
    }
    return <HeaderPage />;
  };

  return (
    <div>
      {chooseHeader()}
      <div className="contact-container">
        <div className="contact-container-left">
          <div className="contact-us-title">{t("contact_us")}</div>
          <div className="contact-us-desc">{t("contact_extra_info")}</div>
          <div className="contact-us-program">
            <div className="contact-us-program-title">{t("program")}</div>
            <div className="contact-us-program-hours">{t("program_m_f")}</div>
            <div className="contact-us-program-hours">
              8:00 AM – 8:00 PM CET
            </div>
            <div className="contact-us-program-hours">{t("program_s")}</div>
            <div className="contact-us-program-hours">
              9:00 AM – 6:00 PM CET
            </div>
          </div>
        </div>
        <div className="contact-container-right">
          <div className="contact-title">{t("get_in_touch")}</div>
          <div className="contact-description">{t("about_our_team")}</div>
          <div className="contact-cards">
            <Card
              className="contact-card"
              interactive={false}
              elevation={Elevation.TWO}
            >
              <Icon className="contact-icon" icon="envelope" size={50} />
              <div>{t("principal_contact")}</div>
              <div className="contact-imp">
                <a href={"mailto:" + PRINCIPAL_ADMIN_EMAIL}>
                  {PRINCIPAL_ADMIN_EMAIL}
                </a>
              </div>
            </Card>
            <Card
              className="contact-card"
              interactive={false}
              elevation={Elevation.TWO}
            >
              <Icon className="contact-icon" icon="phone" size={50} />
              <div>{t("phone")}</div>
              <div className="contact-imp">0746111123</div>
            </Card>
          </div>
          <div className="additional-contacts">
            <div className="contact-title-additional">
              {t("additional_contacts")}
            </div>
            <ul className="admin-contact-list">
              {admins.map(
                (admin) =>
                  admin.email !== PRINCIPAL_ADMIN_EMAIL && (
                    <li key={admin.email} className="admin-item">
                      <Icon icon="user" size={30} />
                      <div className="admin-contact-additional">
                        <div className="admin-username">{admin.username}</div>
                        <a
                          className="admin-email"
                          href={"mailto:" + admin.email}
                        >
                          {admin.email}
                        </a>
                      </div>
                    </li>
                  ),
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
