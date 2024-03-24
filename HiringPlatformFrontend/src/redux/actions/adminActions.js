export const setAdminData = (isAuthenticated, admin, token) => ({
    type: 'SET_ADMIN_DATA',
    payload: {isAuthenticated, admin, token},
});
