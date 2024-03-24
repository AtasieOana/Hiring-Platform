import React from 'react';
import {useSelector} from "react-redux";
import './EditAccount.css';
import EditAccountPageCandidate from "./EditAccountPageCandidate";
import EditAccountPageEmployer from "./EditAccountPageEmployer";
import EditAccountPageAdmin from "./EditAccountPageAdmin";

const EditAccountPage = () => {

    const candidate = useSelector(state => state.auth.candidate);
    const employer = useSelector(state => state.auth.employer);
    const admin = useSelector(state => state.admin.admin);

    return (
        <div>
            {candidate && candidate.candidateId !== "" && <EditAccountPageCandidate></EditAccountPageCandidate>}
            {employer && employer.employerId !== "" && <EditAccountPageEmployer></EditAccountPageEmployer>}
            {admin && admin.adminId !== "" && <EditAccountPageAdmin></EditAccountPageAdmin>}
        </div>
    );
};

export default EditAccountPage;
