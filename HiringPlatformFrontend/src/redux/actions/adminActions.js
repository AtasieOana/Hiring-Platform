export const setAdminData = (isAdmin, admin, token) => ({
    type: 'SET_ADMIN_DATA',
    payload: {isAdmin, admin, token},
});
