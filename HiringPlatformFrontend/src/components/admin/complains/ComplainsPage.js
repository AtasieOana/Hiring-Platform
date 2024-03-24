import React, {useEffect, useState} from "react";
import {
    Button,
    Intent,
    Checkbox,
    Icon,
    Tooltip,
    NonIdealState,
    Dialog,
    Classes
} from "@blueprintjs/core";
import "./Complains.css"
import HeaderAdmin from "../../header/HeaderAdmin";
import {AppToaster} from "../../common/AppToaster";
import ComplaintService from "../../../services/complaint.service";
import {useTranslation} from "react-i18next";
import {formatDate} from "../../common/CommonMethods";
import {PROCESSED, UNPROCESSED} from "../../../util/constants";
import NoUsers from "../../../resources-photo/No_users_image.png";
import ReactQuillStatic from "../../common/reactQuill/ReactQuillStatic";
import {useSelector} from "react-redux";

export const possibleStatus = [PROCESSED, UNPROCESSED]
export const statusEn = ['Processed', 'Unprocessed']
export const statusRo = ['Procesat', 'Neprocesat']

const Complaints = () => {

    const { t, i18n} = useTranslation();
    const status = i18n.language === "ro" ?  statusRo : statusEn;
    const admin = useSelector(state => state.admin.admin);

    const [complaints, setComplaints] = useState([])
    const [showDrawer, setShowDrawer] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const [selectedStatus, setSelectedStatus] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');


    useEffect(() => {
        ComplaintService.getAllComplaints()
            .then((response) => {
                setComplaints(response.data)
                setSelectedStatus(possibleStatus)
            })
            .catch(error => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('retrieve_complains_err'),
                    intent: Intent.DANGER,
                });
            });
    }, []);

    const handleViewDetails = (complaint) => {
        setSelectedComplaint(complaint);
        setShowDrawer(true);
    };

    const handleCloseDrawer = () => {
        setShowDrawer(false);
        setSelectedComplaint("")
    };

    const handleMarkAsProcessed = (complaint) => {
        let request = {
            complaintId: complaint.complaintId,
            adminId: admin.adminId,
        }
        ComplaintService.updateComplaintStatus(request)
            .then((response) => {
                setComplaints(response.data)
                handleCloseDrawer()
                AppToaster.show({
                    message: t('status_complains_success'),
                    intent: Intent.SUCCESS,
                });
            })
            .catch(error => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('status_complains_err'),
                    intent: Intent.DANGER,
                });
            });
    };

    const handleStatusCheckboxChange = (status) => {
        if (selectedStatus.includes(status)) {
            setSelectedStatus(selectedStatus.filter(selected => selected !== status));
        } else {
            setSelectedStatus([...selectedStatus, status]);
        }
    };

    const filteredStatus = complaints.filter(c =>
        selectedStatus.includes(c.status)
    );

    const sortedStatus = sortOrder === 'asc' ?
        filteredStatus.sort((a, b) => new Date(a.complaintDate) - new Date(b.complaintDate)) :
        filteredStatus.sort((a, b) => new Date(b.complaintDate) - new Date(a.complaintDate));

    return (
        <div>
            <HeaderAdmin/>
            <div className="admin-instructions">
                {t('complains_admin_info')}
            </div>
            <div className="users-actions">
                <div className="roles-checkbox">
                    {status.map((s, index) => (
                        <Checkbox
                            key={index}
                            className="user-role-checkbox-item"
                            label={s}
                            checked={selectedStatus.includes(possibleStatus[index])}
                            onChange={() => handleStatusCheckboxChange(possibleStatus[index])}
                        />
                    ))}
                </div>
                <div className="search-and-sort">
                    <Tooltip className="sort-jobs-tooltip"
                             content={sortOrder === 'asc' ? t('sort_complaints_desc') : t('sort_complaints_asc')}
                             position="bottom-left">
                        <Button
                            className="sort-jobs-button"
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            small
                            minimal
                            rightIcon={sortOrder !== 'asc' ? <Icon size={14} icon="sort-asc" color="black"/> :
                                <Icon size={14} icon="sort-desc" color="black"/>}
                        >
                            {t('sort_by_post_date')}
                        </Button>
                    </Tooltip>
                </div>
            </div>
            {sortedStatus.length > 0 ? (
                    <table className="bp4-html-table bp4-html-table-bordered complaints-table">
                        <thead>
                        <tr>
                            <th>{t('complainant_user')}</th>
                            <th>{t('complainant_user')}</th>
                            <th>{t('status')}</th>
                            <th>{t('admin')}</th>
                            <th>{t('date')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedStatus.map((complaint, index) => (
                            <tr key={index}>
                                <td>{complaint.complainantUserEmail}</td>
                                <td>{complaint.complainedUserEmail}</td>
                                <td className={complaint.status === UNPROCESSED ? "red-status-complaint": ""}>{status[possibleStatus.findIndex(i => i === complaint.status)]}</td>
                                <td>{complaint.processingAdminEmail}</td>
                                <td>{formatDate(complaint.complaintDate)}</td>
                                <td className="complaint-actions">
                                    <Tooltip content={t('view_motivation')} position="bottom-right">
                                        <Button
                                            className="users-view-more-button"
                                            icon="list"
                                            intent={Intent.PRIMARY}
                                            onClick={() => handleViewDetails(complaint)}
                                            minimal
                                            small
                                        />
                                    </Tooltip>
                                    {!complaint.status !== UNPROCESSED && (
                                        <Tooltip content={t('mark_processed')} position="bottom-right">
                                            <Button
                                                className="users-view-more-button"
                                                icon="endorsed"
                                                intent={Intent.SUCCESS}
                                                onClick={() => handleMarkAsProcessed(complaint)}
                                                minimal
                                                small
                                            />
                                        </Tooltip>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )
                    :
                <NonIdealState
                    icon={<img src={NoUsers} alt="No User Found"/>}
                    title={t('no_complaints_found')}
                    description={t('no_complaints_found_explanation')}
                    className="no-users-found"
                />
            }
            {selectedComplaint && (
                <Dialog
                    isOpen={showDrawer}
                    onClose={handleCloseDrawer}
                    title={t('complaint_details')}
                    canOutsideClickClose={false}
                    className="complaint-show-dialog"
                >
                    <div className={Classes.DIALOG_BODY}>
                        <ReactQuillStatic value={selectedComplaint.motivation}/>
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button intent="success"
                                    onClick={()=>handleMarkAsProcessed(selectedComplaint)}>{t('mark_processed')}</Button>
                            <Button onClick={handleCloseDrawer}>{t('cancel_person')}</Button>
                        </div>
                    </div>
                </Dialog>
                )}
</div>
)
;
}
;

export default Complaints;
