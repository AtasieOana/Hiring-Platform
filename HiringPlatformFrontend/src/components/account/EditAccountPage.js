import React from 'react';
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import './EditAccount.css';
import EditAccountPageCandidate from "./EditAccountPageCandidate";
import EditAccountPageEmployer from "./EditAccountPageEmployer";

const EditAccountPage = () => {

    const {t} = useTranslation();
    const candidate = useSelector(state => state.auth.candidate);
    const employer = useSelector(state => state.auth.employer);

    return (
        <div>
            {candidate && candidate.candidateId !== "" && <EditAccountPageCandidate></EditAccountPageCandidate>}
            {employer && employer.employerId !== "" && <EditAccountPageEmployer></EditAccountPageEmployer>}
        </div>
    );
};

export default EditAccountPage;
