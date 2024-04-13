import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/HeaderAuth.css';
import {Icon, Menu, MenuItem, Popover} from "@blueprintjs/core";
import {useTranslation} from 'react-i18next';
import {GBFlag, ROFlag} from "../common/CommonMethods";

const HeaderAdminAuthPage = () => {

    const {t, i18n} = useTranslation();

    // Change the language
    const changeLanguage = () => {
        let oldLanguage = i18n.language;
        const newLanguage = oldLanguage === 'ro' ? 'en' : 'ro';
        i18n.changeLanguage(newLanguage);
    };

    return (
        <div className="header-auth">
            <div className="company-name-auth">JOBLISTIC</div>

            <div className="navigation-auth">
                <Popover
                    interactionKind="hover"
                    usePortal={false}
                    content={
                        <Menu className={"menu-language"}>
                            <MenuItem text="English" selected={i18n.language === 'en'}
                                      icon={GBFlag()}
                                      disabled={i18n.language === 'en'} onClick={() => changeLanguage()} />
                            <MenuItem text="Română" selected={i18n.language === 'ro'}
                                      icon={ROFlag()}
                                      disabled={i18n.language === 'ro'} onClick={() => changeLanguage()} />
                        </Menu>
                    }
                    position="bottom"
                >
                    <div className="nav-item-language nav-item-admin">
                        <Icon size={13} icon={i18n.language === 'en' ? GBFlag() : ROFlag()} color="white" className="nav-icon"/> {i18n.language === 'en' ? 'English' : 'Română'}
                        <Icon size={13} icon="chevron-down" color="white" className="nav-icon"/>
                    </div>
                </Popover>
            </div>
        </div>
    );
};

export default HeaderAdminAuthPage;
