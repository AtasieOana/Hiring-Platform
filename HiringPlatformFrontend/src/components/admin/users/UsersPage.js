// UsersPage.js

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppToaster } from "../../common/AppToaster";
import AdminService from "../../../services/admin.service";
import { useTranslation } from "react-i18next";
import {
    Button,
    Checkbox,
    Classes,
    Dialog,
    FormGroup,
    Icon,
    InputGroup,
    Intent,
    NonIdealState, TextArea,
    Tooltip
} from '@blueprintjs/core';
import HeaderPageAdmin from "../../header/HeaderAdmin";
import './Users.css';
import {ADMIN_ACCOUNT, CANDIDATE_ACCOUNT, EMPLOYER_ACCOUNT, PRINCIPAL_ADMIN_EMAIL} from "../../../util/constants";
import NoUsers from "../../../resources-photo/No_users_image.png";
import {formatDate} from "../../common/CommonMethods";
import {emailRegex} from "../../cv/CreateCV";
import AuthenticationService from "../../../services/authentication.service";

export const possibleRoles = [CANDIDATE_ACCOUNT, EMPLOYER_ACCOUNT, ADMIN_ACCOUNT]
export const rolesEn = ['Candidate', 'Employer', 'Admin']
export const rolesRo = ['Candidat', 'Angajator', 'Admin']

const UsersPage = () => {
    const { t, i18n} = useTranslation();
    const admin = useSelector(state => state.admin.admin);
    const roles = i18n.language === "ro" ? rolesRo : rolesEn

    const [users, setUsers] = useState([]);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);

    const [reason, setReason] = useState("");
    const [reasonError, setReasonError] = useState(false);


    useEffect(() => {
        if (admin && admin.adminId !== "") {
            getAllUsers();
        }
    }, []);

    const getAllUsers = () => {
        AdminService.getUserList().then((response) => {
            setUsers(response.data);
            setSelectedRoles(possibleRoles)
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('users_retrieval_err'),
                intent: Intent.DANGER,
            });
        });
    }

    const validateComplaint = () =>{
        if(reason.length <= 0){
            setReasonError(true)
            return true;
        }
        else{
            setReasonError(false)
            return false;
        }
    }

    const handleAddUser = () => {
        const newUser = {
            email: email,
            password: password,
            username: username,
            creatorId: admin.adminId
        };
        AdminService.addAdmin(newUser).then((response) => {
            setUsers(response.data);
            closeAddDialog()
            AppToaster.show({
                message: t('add_admin_success'),
                intent: Intent.SUCCESS,
            });
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: t('add_admin_err'),
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
                setUserToDelete(null)
                AppToaster.show({
                    message: t('delete_admin_success'),
                    intent: Intent.SUCCESS,
                });
            })
            .catch(error => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('delete_admin_err'),
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
        }
        AuthenticationService.deleteUserByAdmin(request)
            .then(() => {
                getAllUsers()
                setIsDeleteModalOpen(false);
                setReason("");
                setReasonError(false);
                setUserToDelete(null);
                AppToaster.show({
                    message: t('delete_admin_success'),
                    intent: Intent.SUCCESS,
                });
            })
            .catch(error => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('delete_admin_err'),
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

    const handleRoleCheckboxChange = role => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter(selectedRole => selectedRole !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    const closeAddDialog = () =>{
        setIsAddUserModalOpen(false)
        setEmail("")
        setPassword("")
        setUsername("")
        setConfirmPassword("")
    }

    const renderAddAdminDialog = () =>{
        const usernameRegex = /^[a-zA-ZăâîșțĂÂÎȘȚ0-9\-& ]*$/;
        const existUserWithSameEmail = users.filter(u => u.email === email).length !== 0
        return <Dialog isOpen={isAddUserModalOpen}
                       onClose={closeAddDialog} title={t('add_admin')}
                       canOutsideClickClose={false}
                       className="add-admin-dialog"
        >
            <div className={Classes.DIALOG_BODY}>
                <FormGroup
                    label={t('email_address')}
                    labelInfo={t('required')}
                    intent={!emailRegex.test(email) || existUserWithSameEmail ? Intent.DANGER : Intent.NONE}
                    helperText={!emailRegex.test(email) ? t('email_address_in') : existUserWithSameEmail ? t('email_address_exist') : ""}
                >
                    <InputGroup value={email} onChange={e => setEmail(e.target.value)}/>
                </FormGroup>
                <FormGroup
                    label={t('username')}
                    labelInfo={t('required')}
                    helperText={!usernameRegex.test(username) || username.length < 3 ? t('username_in') : ""}
                    intent={!usernameRegex.test(username) || username.length < 3 ? Intent.DANGER : Intent.NONE}
                >
                    <InputGroup value={username} onChange={e => setUsername(e.target.value)}/>
                </FormGroup>
                <div className="password-fields">
                    <FormGroup
                        label={t('default_password')}
                        intent={password.length < 5 ? Intent.DANGER : Intent.NONE}
                        helperText={password.length < 5 ? t('password_err') : ""}
                        labelInfo={t('required')}
                    >
                        <InputGroup
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            autoComplete="new-password"
                            placeholder={t('password_placeholder')}
                            onChange={(e) => setPassword(e.target.value)}
                            rightElement={
                                <Button
                                    className="password-button"
                                    icon={showPassword ? 'eye-off' : 'eye-open'}
                                    minimal={true}
                                    onClick={togglePasswordVisibility}
                                    small={true}
                                    fill
                                />
                            }
                        />
                    </FormGroup>
                    <FormGroup
                        label={t('confirm_password')}
                        intent={confirmPassword !==  password ? Intent.DANGER : Intent.NONE}
                        helperText={confirmPassword !==  password ? t('confirm_password_err') : ""}
                        labelInfo={t('required')}
                    >
                        <InputGroup
                            type={showConfPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            placeholder={t('password_confirm_placeholder')}
                            autoComplete="new-password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            rightElement={
                                <Button
                                    className="password-button"
                                    icon={showConfPassword ? 'eye-off' : 'eye-open'}
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
                    <Button intent="primary"
                            onClick={handleAddUser}
                            disabled={!emailRegex.test(email) || confirmPassword !==  password || password.length < 5 || !usernameRegex.test(username) || username.length < 3}
                    >{t('add_person')}</Button>
                    <Button onClick={closeAddDialog}>{t('cancel_person')}</Button>
                </div>
            </div>
        </Dialog>
    }

    const renderRemoveDialog = () =>{
        return <Dialog isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}
                       title={t('delete_user')}
                       className="add-admin-dialog"
                       canOutsideClickClose={false}
        >
            <div className={Classes.DIALOG_BODY}>
                <p>{t('delete_conf')}</p>
                {
                    userToDelete?.userRole !== ADMIN_ACCOUNT &&
                    <FormGroup
                        intent={reasonError ? Intent.DANGER : Intent.NONE}
                        helperText={reasonError ? t('remove_reason_in') : ""}
                        label={t('reason_for_removal')}
                    >
                        <TextArea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            style={{width: "100%", resize: "none"}}
                        />
                    </FormGroup>
                }
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button intent="danger" onClick={userToDelete?.userRole === ADMIN_ACCOUNT ? handleDeleteAdmin : handleDeleteUser}>{t('delete')}</Button>
                    <Button onClick={() => {
                        setIsDeleteModalOpen(false);
                        setReason("")
                        setReasonError(false)
                        }
                    }>{t('cancel_person')}</Button>
                </div>
            </div>
        </Dialog>
    }

    const filteredUsers = users.filter(user =>
        (user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.userName.toLowerCase().includes(searchTerm.toLowerCase())) &&
        selectedRoles.includes(user.userRole)
    );

    const sortedUsers = sortOrder === 'asc' ?
        filteredUsers.sort((a, b) => new Date(a.registrationDate) - new Date(b.registrationDate)) :
        filteredUsers.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));

    return (
        <div>
            <HeaderPageAdmin/>
            <div className="users-info-text">
                <div>{t('users_clarifications')}</div>
                <ul>
                    <li>{t('users_clarifications1')}</li>
                    <li>{t('users_clarifications2')} - <span
                        className="users-principal-admin">{PRINCIPAL_ADMIN_EMAIL}</span> - {t('users_clarifications2_1')}
                    </li>
                    <li>{t('users_clarifications3')}</li>
                </ul>
            </div>
            <div className="users-add-container">
                <Button
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="users-add-button"
                >
                    {t('add_admin')}
                </Button>
            </div>
            <div className="users-actions">
                <div className="roles-checkbox">
                    {roles.map((role, index) => (
                        <Checkbox
                            key={index}
                            className="user-role-checkbox-item"
                            label={role}
                            checked={selectedRoles.includes(possibleRoles[index])}
                            onChange={() => handleRoleCheckboxChange(possibleRoles[index])}
                        />
                    ))}
                </div>
                <div className="search-and-sort">
                    <Tooltip className="sort-jobs-tooltip" content={sortOrder === 'asc' ? t('sort_users_desc') : t('sort_users_asc')} position="bottom-left">
                        <Button
                            className="sort-jobs-button"
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            small
                            minimal
                            rightIcon={sortOrder !== 'asc' ? <Icon size={14} icon="sort-asc" color="black"/> : <Icon size={14} icon="sort-desc" color="black"/>}
                        >
                            {t('sort_by_post_date')}
                        </Button>
                    </Tooltip>
                    <InputGroup
                        disabled={false}
                        placeholder={t('search_user')}
                        type="search"
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            {sortedUsers.length > 0 ? (
                <table className="bp4-html-table bp4-html-table-bordered users-table">
                    <thead>
                    <tr>
                        <th>{t('email_address')}</th>
                        <th>{t('name')}</th>
                        <th>{t('reg_date')}</th>
                        <th>{t('acc_enabled')}</th>
                        <th>{t('role')}</th>
                        <th>{t('user_creator')}</th>
                        <th>{t('actions')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedUsers.map(user => (
                        <tr key={user.userId} className={user.userRole === ADMIN_ACCOUNT ? 'admin-row' :
                            user.userRole === CANDIDATE_ACCOUNT ? 'candidate-row' :
                                user.userRole === EMPLOYER_ACCOUNT ? 'employer-row' : ''}>
                            <td>{user.email}</td>
                            <td>{user.userName}</td>
                            <td>{formatDate(user.registrationDate)}</td>
                            <td>{user.accountEnabled ? t('yes') : t('no')}</td>
                            <td>{roles[possibleRoles.findIndex(i => i === user.userRole)]}</td>
                            <td>{user.usernameCreator}</td>
                            <td>
                                {(admin && (user.userRole !== ADMIN_ACCOUNT ||  admin.adminId === user.idCreator || admin.userDetails.email === PRINCIPAL_ADMIN_EMAIL) && user.email !== PRINCIPAL_ADMIN_EMAIL) &&
                                    <Tooltip content={t('delete_user')} position="bottom-right">
                                        <Button
                                            className="users-delete-button"
                                            icon="trash"
                                            intent={Intent.DANGER}
                                            onClick={() => {
                                                setUserToDelete(user);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            minimal
                                            small
                                        />
                                    </Tooltip>
                                }
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <NonIdealState
                    icon={<img src={NoUsers} alt="No User Found"/>}
                    title={t('no_user_found')}
                    description={t('no_user_found_explanation')}
                    className="no-users-found"
                />
            )}
            {renderAddAdminDialog()}
            {renderRemoveDialog()}
        </div>
    );
};

export default UsersPage;
