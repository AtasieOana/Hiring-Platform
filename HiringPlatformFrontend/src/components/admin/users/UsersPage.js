import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppToaster } from "../../common/AppToaster";
import AdminService from "../../../services/admin.service";
import { useTranslation } from "react-i18next";
import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  Icon,
  InputGroup,
  Intent,
  MenuItem,
  NonIdealState,
  Position,
  Tag,
  TextArea,
  Tooltip,
} from "@blueprintjs/core";
import HeaderPageAdmin from "../../header/HeaderAdmin";
import "./Users.css";
import {
  ADMIN_ACCOUNT,
  CANDIDATE_ACCOUNT,
  EMPLOYER_ACCOUNT,
  PRINCIPAL_ADMIN_EMAIL,
} from "../../../util/constants";
import NoUsers from "../../../resources-photo/No_users_image.png";
import { formatDate } from "../../common/CommonMethods";
import { emailRegex } from "../../cv/CreateCV";
import AuthenticationService from "../../../services/authentication.service";
import { Select } from "@blueprintjs/select";
import ReactPaginate from "react-paginate";

export const possibleRoles = [
  "All",
  ADMIN_ACCOUNT,
  CANDIDATE_ACCOUNT,
  EMPLOYER_ACCOUNT,
];
const rolesEn = ["All", "Admin", "Candidate", "Employer"];
const rolesRo = ["Toate", "Admin", "Candidat", "Angajator"];

const PAGE_SIZE = 7; // Number of users per page

const UsersPage = () => {
  const { t, i18n } = useTranslation();
  const admin = useSelector((state) => state.admin.admin);
  const roles = i18n.language === "ro" ? rolesRo : rolesEn;

  const [users, setUsers] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedRole, setSelectedRole] = useState("All");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);

  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);

  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (admin && admin.adminId !== "") {
      getAllUsers();
    }
  }, []);

  const getAllUsers = () => {
    AdminService.getUserList()
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error: ", error.message);
        AppToaster.show({
          message: t("users_retrieval_err"),
          intent: Intent.DANGER,
        });
      });
  };

  const validateComplaint = () => {
    if (reason.length <= 0) {
      setReasonError(true);
      return true;
    } else {
      setReasonError(false);
      return false;
    }
  };

  const handleAddUser = () => {
    const newUser = {
      email: email,
      password: password,
      username: username,
      creatorId: admin.adminId,
    };
    AdminService.addAdmin(newUser)
      .then((response) => {
        setUsers(response.data);
        closeAddDialog();
        AppToaster.show({
          message: t("add_admin_success"),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {
        console.error("Error: ", error.message);
        AppToaster.show({
          message: t("add_admin_err"),
          intent: Intent.DANGER,
        });
      });
  };

  const handleDeleteAdmin = () => {
    if (!userToDelete) return;
    AdminService.deleteAdmin(admin.userDetails.email, userToDelete.email)
      .then((response) => {
        setUsers(response.data);
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        AppToaster.show({
          message: t("delete_admin_success"),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {
        console.error("Error: ", error.message);
        AppToaster.show({
          message: t("delete_admin_err"),
          intent: Intent.DANGER,
        });
      });
  };

  const handleDeleteUser = () => {
    if (!userToDelete || validateComplaint()) return;
    let request = {
      emailUser: userToDelete.email,
      emailAdmin: admin.userDetails.email,
      reason: reason,
    };
    AuthenticationService.deleteUserByAdmin(request)
      .then(() => {
        getAllUsers();
        setIsDeleteModalOpen(false);
        setReason("");
        setReasonError(false);
        setUserToDelete(null);
        AppToaster.show({
          message: t("delete_admin_success"),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {
        console.error("Error: ", error.message);
        AppToaster.show({
          message: t("delete_admin_err"),
          intent: Intent.DANGER,
        });
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfPasswordVisibility = () => {
    setShowConfPassword(!showConfPassword);
  };

  const closeAddDialog = () => {
    setIsAddUserModalOpen(false);
    setEmail("");
    setPassword("");
    setUsername("");
    setConfirmPassword("");
  };

  const renderRole = (role, { handleClick, modifiers, _query }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={modifiers.active}
        disabled={modifiers.disabled}
        text={role}
        key={role}
        onClick={handleClick}
        shouldDismissPopover={true}
      />
    );
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const renderAddAdminDialog = () => {
    const usernameRegex = /^[a-zA-ZăâîșțĂÂÎȘȚ0-9\-& ]*$/;
    const existUserWithSameEmail =
      users.filter((u) => u.email === email).length !== 0;
    return (
      <Dialog
        isOpen={isAddUserModalOpen}
        onClose={closeAddDialog}
        title={t("add_admin")}
        canOutsideClickClose={false}
        className="add-admin-dialog"
      >
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label={t("email_address")}
            labelInfo={"*"}
            intent={
              !emailRegex.test(email) || existUserWithSameEmail
                ? Intent.DANGER
                : Intent.NONE
            }
            helperText={
              !emailRegex.test(email)
                ? t("email_address_in")
                : existUserWithSameEmail
                  ? t("email_address_exist")
                  : ""
            }
          >
            <InputGroup
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup
            label={t("username")}
            labelInfo={"*"}
            helperText={
              !usernameRegex.test(username) || username.length < 3
                ? t("username_in")
                : ""
            }
            intent={
              !usernameRegex.test(username) || username.length < 3
                ? Intent.DANGER
                : Intent.NONE
            }
          >
            <InputGroup
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormGroup>
          <div className="password-fields">
            <FormGroup
              label={t("default_password")}
              intent={password.length < 5 ? Intent.DANGER : Intent.NONE}
              helperText={password.length < 5 ? t("password_err") : ""}
              labelInfo={"*"}
            >
              <InputGroup
                type={showPassword ? "text" : "password"}
                value={password}
                autoComplete="new-password"
                placeholder={t("password_placeholder")}
                onChange={(e) => setPassword(e.target.value)}
                rightElement={
                  <Button
                    className="password-button"
                    icon={showPassword ? "eye-off" : "eye-open"}
                    minimal={true}
                    onClick={togglePasswordVisibility}
                    small={true}
                    fill
                  />
                }
              />
            </FormGroup>
            <FormGroup
              label={t("confirm_password")}
              intent={
                confirmPassword !== password ? Intent.DANGER : Intent.NONE
              }
              helperText={
                confirmPassword !== password ? t("confirm_password_err") : ""
              }
              labelInfo={"*"}
            >
              <InputGroup
                type={showConfPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder={t("password_confirm_placeholder")}
                autoComplete="new-password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                rightElement={
                  <Button
                    className="password-button"
                    icon={showConfPassword ? "eye-off" : "eye-open"}
                    minimal={true}
                    onClick={toggleConfPasswordVisibility}
                    small={true}
                    fill
                  />
                }
              />
            </FormGroup>
          </div>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              intent="primary"
              onClick={handleAddUser}
              disabled={
                !emailRegex.test(email) ||
                confirmPassword !== password ||
                password.length < 5 ||
                !usernameRegex.test(username) ||
                username.length < 3
              }
              className={"user-button-for-outline"}
            >
              {t("add_person")}
            </Button>
            <Button
              onClick={closeAddDialog}
              className={"user-button-for-outline"}
            >
              {t("cancel_person")}
            </Button>
          </div>
        </div>
      </Dialog>
    );
  };

  const renderRemoveDialog = () => {
    return (
      <Dialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t("delete_user")}
        className="add-admin-dialog"
        canOutsideClickClose={false}
      >
        <div className={Classes.DIALOG_BODY} style={{ textAlign: "justify" }}>
          <p>
            {t("delete_conf1")} <strong> {userToDelete.email} </strong>
            {t("delete_conf2")}
          </p>
          {userToDelete?.userRole !== ADMIN_ACCOUNT && (
            <FormGroup
              intent={reasonError ? Intent.DANGER : Intent.NONE}
              helperText={reasonError ? t("remove_reason_in") : ""}
              label={t("reason_for_removal")}
            >
              <TextArea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                style={{ width: "100%", resize: "none" }}
              />
            </FormGroup>
          )}
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              intent="danger"
              onClick={
                userToDelete?.userRole === ADMIN_ACCOUNT
                  ? handleDeleteAdmin
                  : handleDeleteUser
              }
              className={"user-button-for-outline"}
            >
              {t("delete")}
            </Button>
            <Button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setReason("");
                setReasonError(false);
              }}
              className={"user-button-for-outline"}
            >
              {t("cancel_person")}
            </Button>
          </div>
        </div>
      </Dialog>
    );
  };

  const handleRoleChange = (role) => {
    if (role === rolesEn[1] || role === roles[1]) {
      setSelectedRole(ADMIN_ACCOUNT);
    } else {
      if (role === rolesEn[2] || role === roles[2]) {
        setSelectedRole(CANDIDATE_ACCOUNT);
      } else {
        if (role === rolesEn[3] || role === roles[3]) {
          setSelectedRole(EMPLOYER_ACCOUNT);
        } else {
          setSelectedRole("All");
        }
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

  const filteredUsers = users.filter(
    (user) =>
      (user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedRole === "All" || user.userRole === selectedRole),
  );

  const sortedUsers = filteredUsers.sort((a, b) => {
    if (sortColumn === "email") {
      return sortOrder === "asc"
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email);
    } else if (sortColumn === "name") {
      return sortOrder === "asc"
        ? a.userName.localeCompare(b.userName)
        : b.userName.localeCompare(a.userName);
    } else if (sortColumn === "registrationDate") {
      return sortOrder === "asc"
        ? new Date(a.registrationDate) - new Date(b.registrationDate)
        : new Date(b.registrationDate) - new Date(a.registrationDate);
    }
    return 0;
  });

  const paginatedUsers = sortedUsers.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );

  const totalPages = Math.ceil(sortedUsers.length / PAGE_SIZE);

  return (
    <div>
      <HeaderPageAdmin />
      <div className="users-info-text">
        <div className="users-info-text-helper">
          <span>{t("user_management")}</span>
          <Tooltip
            content={
              <div className="users-helper-popover-content">
                <ul>
                  <li>{t("users_clarifications1")}</li>
                  <li>
                    {t("users_clarifications2")} -{" "}
                    <span className="users-principal-admin">
                      {PRINCIPAL_ADMIN_EMAIL}
                    </span>{" "}
                    - {t("users_clarifications2_1")}
                  </li>
                  <li>{t("users_clarifications3")}</li>
                </ul>
              </div>
            }
            position="right"
            portalClassName="users-helper-popover"
          >
            <Button className="user-helper-icon" icon="help" minimal={true} />
          </Tooltip>
        </div>
        <div className="users-add-container">
          <Button
            className="users-add-button"
            onClick={() => setIsAddUserModalOpen(true)}
          >
            {t("add_admin")}
          </Button>
        </div>
      </div>
      <div className="users-actions">
        <InputGroup
          placeholder={t("search_user")}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="users-search-bar"
        />
        <FormGroup
          label={t("role") + ": "}
          inline
          className="user-filter-by-role"
        >
          <Select
            items={roles}
            fill={true}
            matchTargetWidth={true}
            filterable={false}
            itemRenderer={renderRole}
            onItemSelect={(e) => handleRoleChange(e)}
            popoverProps={{ position: Position.BOTTOM }}
          >
            <Button
              text={roles[possibleRoles.findIndex((d) => d === selectedRole)]}
              rightIcon="double-caret-vertical"
              fill={true}
              className={"user-button-for-outline"}
            />
          </Select>
        </FormGroup>
      </div>
      {paginatedUsers.length > 0 ? (
        <table className="bp4-html-table users-table">
          <thead>
            <tr>
              <th
                className="user-table-sorted"
                onClick={() => handleSort("email")}
              >
                {t("email_address")} <Icon icon="double-caret-vertical" />
              </th>
              <th
                className="user-table-sorted"
                onClick={() => handleSort("name")}
              >
                {t("name")} <Icon icon="double-caret-vertical" />
              </th>
              <th
                className="user-table-sorted"
                onClick={() => handleSort("registrationDate")}
              >
                {t("reg_date")} <Icon icon="double-caret-vertical" />
              </th>
              <th>{t("acc_enabled")}</th>
              <th>{t("role")}</th>
              <th>{t("user_creator")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr
                key={user.userId}
                className={user.userRole.toLowerCase() + "-row"}
              >
                <td>{user.email}</td>
                <td>{user.userName}</td>
                <td>{formatDate(user.registrationDate)}</td>
                <td>
                  <Tag
                    intent={
                      user.accountEnabled ? Intent.SUCCESS : Intent.WARNING
                    }
                  >
                    {user.accountEnabled ? t("activated") : t("pending")}
                  </Tag>
                </td>
                <td>
                  {roles[possibleRoles.findIndex((i) => i === user.userRole)]}
                </td>
                <td>{user.usernameCreator}</td>
                <td>
                  <Tooltip content={t("delete_user")} position="bottom-right">
                    <Button
                      icon="trash"
                      intent={Intent.DANGER}
                      onClick={() => {
                        setUserToDelete(user);
                        setIsDeleteModalOpen(true);
                      }}
                      className={"delete-user-button"}
                      minimal
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
          title={t("no_user_found")}
          description={t("no_user_found_explanation")}
          className="no-users-found"
        />
      )}
      {paginatedUsers.length > 0 && totalPages > 1 && (
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
      {renderAddAdminDialog()}
      {isDeleteModalOpen && renderRemoveDialog()}
    </div>
  );
};

export default UsersPage;
