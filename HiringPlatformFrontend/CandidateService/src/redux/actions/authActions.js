export const setAuthData = (isAuthenticated, candidate, token) => ({
    type: 'SET_AUTH_DATA',
    payload: {isAuthenticated, candidate, token},
});
