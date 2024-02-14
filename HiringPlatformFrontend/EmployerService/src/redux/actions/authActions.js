export const setAuthData = (isAuthenticated, employer, token) => ({
    type: 'SET_AUTH_DATA',
    payload: {isAuthenticated, employer, token},
});
