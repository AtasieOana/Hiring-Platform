import React, { useEffect, useState } from "react";
import {
  Button,
  Intent,
  Checkbox,
  Icon,
  Tooltip,
  NonIdealState,
  Dialog,
  Classes,
  InputGroup,
  FormGroup,
  Position,
  MenuItem,
  Tag,
} from "@blueprintjs/core";
import "./Complains.css";
import HeaderAdmin from "../../header/HeaderAdmin";
import { AppToaster } from "../../common/AppToaster";
import ComplaintService from "../../../services/complaint.service";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../common/CommonMethods";
import {
  ADMIN_ACCOUNT,
  CANDIDATE_ACCOUNT,
  EMPLOYER_ACCOUNT,
  PRINCIPAL_ADMIN_EMAIL,
  PROCESSED,
  UNPROCESSED,
} from "../../../util/constants";
import NoUsers from "../../../resources-photo/No_users_image.png";
import ReactQuillStatic from "../../common/reactQuill/ReactQuillStatic";
import { useSelector } from "react-redux";
import { Select } from "@blueprintjs/select";
import { possibleRoles } from "../users/UsersPage";
import ReactPaginate from "react-paginate";

export const possibleStatus = ["All", PROCESSED, UNPROCESSED];
export const statusEn = ["All", "Processed", "Unprocessed"];
export const statusRo = ["Toate", "Procesat", "Neprocesat"];

const PAGE_SIZE = 7; // Number of reclamations per page

const Complaints = () => {
  const { t, i18n } = useTranslation();
  const status = i18n.language === "ro" ? statusRo : statusEn;
  const admin = useSelector((state) => state.admin.admin);

  const [complaints, setComplaints] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStatus, setSelectedStatus] = useState(possibleStatus[0]);
  const [currentPage, setCurrentPage] = useState(0);

  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    ComplaintService.getAllComplaints()
      .then((response) => {
        setComplaints(response.data);
      })
      .catch((error) => {
        console.error("Error: ", error.message);
        AppToaster.show({
          message: t("retrieve_complains_err"),
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
    setSelectedComplaint("");
  };

  const handleMarkAsProcessed = (complaint) => {
    let request = {
      complaintId: complaint.complaintId,
      adminId: admin.adminId,
    };
    ComplaintService.updateComplaintStatus(request)
      .then((response) => {
        setComplaints(response.data);
        handleCloseDrawer();
        AppToaster.show({
          message: t("status_complains_success"),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {
        console.error("Error: ", error.message);
        AppToaster.show({
          message: t("status_complains_err"),
          intent: Intent.DANGER,
        });
      });
  };

  const renderStatus = (status, { handleClick, modifiers, _query }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={modifiers.active}
        disabled={modifiers.disabled}
        text={status}
        key={status}
        onClick={handleClick}
        shouldDismissPopover={true}
      />
    );
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleStatusChange = (status) => {
    if (status === statusRo[1] || status === statusEn[1]) {
      setSelectedStatus(PROCESSED);
    } else {
      if (status === statusRo[2] || status === statusEn[2]) {
        setSelectedStatus(UNPROCESSED);
      } else {
        setSelectedStatus("All");
      }
    }
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const filteredComplaints = complaints.filter(
    (complaint) =>
      (complaint.complainantUserEmail
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        complaint.complainedUserEmail
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (selectedStatus === "All" || complaint.status === selectedStatus),
  );

  const sortedComplaints = filteredComplaints.sort((a, b) => {
    if (sortColumn === "complainantUserEmail") {
      return sortOrder === "asc"
        ? a.complainantUserEmail.localeCompare(b.complainantUserEmail)
        : b.complainantUserEmail.localeCompare(a.complainantUserEmail);
    } else if (sortColumn === "complainedUserEmail") {
      return sortOrder === "asc"
        ? a.complainedUserEmail.localeCompare(b.complainedUserEmail)
        : b.complainedUserEmail.localeCompare(a.complainedUserEmail);
    } else if (sortColumn === "complaintDate") {
      return sortOrder === "asc"
        ? new Date(a.complaintDate) - new Date(b.complaintDate)
        : new Date(b.complaintDate) - new Date(a.complaintDate);
    }
    return 0;
  });

  const paginatedComplaints = sortedComplaints.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );

  const totalPages = Math.ceil(sortedComplaints.length / PAGE_SIZE);

  console.log(selectedStatus);
  return (
    <div>
      <HeaderAdmin />
      <div className="users-info-text">
        <div className="users-info-text-helper">
          <span>{t("user_reclamations")}</span>
          <Tooltip
            content={
              <div className="users-helper-popover-content">
                <ul>
                  <li>{t("complains_admin_info1")}</li>
                  <li>{t("complains_admin_info2")}</li>
                  <li>{t("complains_admin_info3")}</li>
                </ul>
              </div>
            }
            position="right"
            portalClassName="users-helper-popover"
          >
            <Button className="user-helper-icon" icon="help" minimal={true} />
          </Tooltip>
        </div>
      </div>
      <div className="users-actions">
        <InputGroup
          placeholder={t("search_user")}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="users-search-bar"
        />
        <FormGroup
          label={t("status") + ": "}
          inline
          className="user-filter-by-role"
        >
          <Select
            items={status}
            fill={true}
            matchTargetWidth={true}
            filterable={false}
            itemRenderer={renderStatus}
            onItemSelect={(e) => handleStatusChange(e)}
            popoverProps={{ position: Position.BOTTOM }}
          >
            <Button
              text={
                status[possibleStatus.findIndex((d) => d === selectedStatus)]
              }
              rightIcon="double-caret-vertical"
              fill={true}
              className={"user-button-for-outline"}
            />
          </Select>
        </FormGroup>
      </div>
      {paginatedComplaints.length > 0 ? (
        <table className="bp4-html-table complaints-table">
          <thead>
            <tr>
              <th
                className="complaints-table-sorted"
                onClick={() => handleSort("complainantUserEmail")}
              >
                {t("complainant_user")} <Icon icon="double-caret-vertical" />
              </th>
              <th
                className="complaints-table-sorted"
                onClick={() => handleSort("complainedUserEmail")}
              >
                {t("complainant_user")} <Icon icon="double-caret-vertical" />
              </th>
              <th
                className="complaints-table-sorted"
                onClick={() => handleSort("complaintDate")}
              >
                {t("reclamation_date")} <Icon icon="double-caret-vertical" />
              </th>
              <th>{t("status")}</th>
              <th>{t("admin")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedComplaints.map((complaint, index) => (
              <tr key={index}>
                <td>{complaint.complainantUserEmail}</td>
                <td>{complaint.complainedUserEmail}</td>
                <td>{formatDate(complaint.complaintDate)}</td>
                <td>
                  <Tag
                    intent={
                      complaint.status === UNPROCESSED
                        ? Intent.WARNING
                        : Intent.SUCCESS
                    }
                  >
                    {
                      status[
                        possibleStatus.findIndex((i) => i === complaint.status)
                      ]
                    }
                  </Tag>
                </td>
                <td>{complaint.processingAdminEmail}</td>
                <td className="complaint-actions">
                  <Tooltip
                    content={t("view_motivation")}
                    position="bottom-right"
                  >
                    <Button
                      className="users-view-more-button user-button-for-outline"
                      icon="list"
                      intent={Intent.PRIMARY}
                      onClick={() => handleViewDetails(complaint)}
                      minimal
                      small
                    />
                  </Tooltip>
                  <Tooltip
                    content={t("mark_processed")}
                    position="bottom-right"
                  >
                    <Button
                      className="users-view-more-button user-button-for-outline"
                      icon="tick-circle"
                      intent={Intent.SUCCESS}
                      onClick={() => handleMarkAsProcessed(complaint)}
                      minimal
                      disabled={complaint.status === PROCESSED}
                      small
                    />
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <NonIdealState
          icon={<img src={NoUsers} alt="No User Found" />}
          title={t("no_complaints_found")}
          description={t("no_complaints_found_explanation")}
          className="no-users-found"
        />
      )}
      {paginatedComplaints.length > 0 && totalPages > 1 && (
        <ReactPaginate
          previousLabel={currentPage === 0 ? "" : "<"}
          nextLabel={currentPage === totalPages - 1 ? "" : ">"}
          breakLabel={"..."}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={totalPages}
          onPageChange={handlePageClick}
          containerClassName={"pagination-container"}
          pageClassName={"pagination-page-item"}
          activeClassName={"pagination-active"}
          breakClassName="pagination-page-item"
          previousClassName={currentPage === 0 ? "" : "pagination-prev-label"}
          nextClassName={
            currentPage === totalPages - 1 ? "" : "pagination-next-label"
          }
          renderOnZeroPageCount={null}
        />
      )}
      {selectedComplaint && (
        <Dialog
          isOpen={showDrawer}
          onClose={handleCloseDrawer}
          title={t("complaint_details")}
          canOutsideClickClose={false}
          className="complaint-show-dialog"
        >
          <div className={Classes.DIALOG_BODY}>
            <ReactQuillStatic value={selectedComplaint.motivation} />
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button
                intent="success"
                className={"user-button-for-outline"}
                onClick={() => handleMarkAsProcessed(selectedComplaint)}
                disabled={selectedComplaint.status === PROCESSED}
              >
                {t("mark_processed")}
              </Button>
              <Button
                className={"user-button-for-outline"}
                onClick={handleCloseDrawer}
              >
                {t("cancel_person")}
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};
export default Complaints;
