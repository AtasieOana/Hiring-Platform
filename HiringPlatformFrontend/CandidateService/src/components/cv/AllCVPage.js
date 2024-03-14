import React, {useEffect, useState} from 'react';
import HeaderPage from "../header/HeaderPage";
import {AnchorButton, Button, Icon, Intent, Tooltip} from "@blueprintjs/core";
import {useTranslation} from "react-i18next";
import "./AllCVPage.css"
import CandidateService from "../../services/candidate.service";
import {useSelector} from "react-redux";
import {AppToaster} from "../common/AppToaster";
import firebase from "../../util/firebase";
import { getStorage, ref, getDownloadURL   } from 'firebase/storage';
import {FIREBASE_PATH} from "../../util/constants";

const AllCvPage = () => {

    const {t} = useTranslation();
    const candidate = useSelector(state => state.auth.candidate);

    const [data, setData] = useState([]);
    const [sortTypeCvName, setSortTypeCvName] = useState('asc');
    const [sortTypeDate, setSortTypeDate] = useState('asc');
    const [sortedData, setSortedData] = useState([]);

    useEffect(() => {
        CandidateService.getCvListForCandidate(candidate.candidateId).then((response) => {
            let cvList = response.data;
            let dataCV = cvList.map(cv => {
                let shortName = cv.cvName.split("_").slice(1).join("_");
                return {
                    cvName: shortName,
                    uploadDate: cv.uploadDate,
                    cvId: cv.cvId,
                    cvNameComplete: cv.cvName
                }
            })
            setData(dataCV)
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('cv_list_err'),
                intent: Intent.DANGER,
            });
        });
    }, []);

    const handleOpenCV = (cv) => {
        try {
            const storage = getStorage(firebase);
            const cvRef = ref(storage, FIREBASE_PATH + cv.cvNameComplete);
            getDownloadURL(cvRef).then(r=>window.open(r, '_blank'));
        } catch (error) {
            console.error('Error opening CV:', error);
        }
    };

    /**
     * Sort data by resume name and post date when the sort state changes
     */
    useEffect(() => {
        let dataCopy = [...data]
        dataCopy.sort(compareDate)
        setSortedData(dataCopy);
    }, [data, sortTypeCvName, sortTypeDate]);

    /**
     * Function to sort by resume name
     */
    const sortByCvName = () => {
        setSortTypeCvName(sortTypeCvName === 'asc' ? 'desc' : 'asc');
    };

    /**
     * Function to sort by resume date
     */
    const sortByUploadDate = () => {
        setSortTypeDate(sortTypeDate === 'asc' ? 'desc' : 'asc');
    };

    const compareDate = (a, b) => {
        return compareCvName(a,b) && compareUploadDate(a,b)
    };


    const compareCvName = (a, b) => {
        if (sortTypeCvName === 'asc') {
            return a.cvName.localeCompare(b.cvName);
        } else {
            return b.cvName.localeCompare(a.cvName);
        }
    };

    const compareUploadDate = (a, b) => {
        if (sortTypeDate === 'asc') {
            return a.uploadDate.getTime() - b.uploadDate.getTime();
        } else {
            return b.uploadDate.getTime() - a.uploadDate.getTime();
        }
    };



    return (
        <div>
            <HeaderPage/>
            <div>
                <div className="multiple-cv-motivation">
                    {t('multiple_cv_motivation')}
                </div>
                <div className="add-cv-options">
                    <div className="add-cv-options-text">{t('add_cv_option')}</div>
                    <div className="add-cv-options-button">
                        <Button minimal
                                small
                                className={"add-cv-option"}
                                icon={<Icon icon="arrow-right" size={13} color="black"/>}
                                onClick={() => {
                                }}>
                            {t('upload_a_file')}
                        </Button>
                        <Button minimal
                                small
                                className={"add-cv-option"}
                                icon={<Icon icon="arrow-right" size={13} color="black"/>}
                                onClick={() => {
                                }}>
                            {t('use_standard_template')}
                        </Button>
                    </div>
                    <table
                        className="bp4-html-table bp4-html-table-bordered bp4-html-table-condensed bp4-html-table-striped">
                        <thead>
                        <tr>
                            <th>
                                <Tooltip content="Sortare după nume CV">
                                    <AnchorButton minimal={true} icon={sortTypeCvName === 'asc' ? 'sort-asc' : 'sort-desc'} onClick={sortByCvName}>
                                        Nume CV
                                    </AnchorButton>
                                </Tooltip>
                            </th>
                            <th>
                                <Tooltip content="Sortare după data postării">
                                    <AnchorButton minimal={true} icon={sortTypeDate === 'asc' ? 'sort-asc' : 'sort-desc'} onClick={sortByUploadDate}>
                                        Data postarii
                                    </AnchorButton>
                                </Tooltip>
                            </th>
                            <th>Acțiuni</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedData.map(item => (
                            <tr key={item.cvId}>
                                <td>{item.cvName}</td>
                                <td>{item.uploadDate}</td>
                                <td>
                                    <Tooltip content="Vizualizare CV">
                                        <Icon icon="eye-open" intent={Intent.PRIMARY} style={{marginRight: '10px'}}
                                        onClick={()=>{handleOpenCV(item)}}/>
                                    </Tooltip>
                                    <Tooltip content="Ștergere CV">
                                        <Icon icon="trash" intent={Intent.DANGER}/>
                                    </Tooltip>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default AllCvPage;
