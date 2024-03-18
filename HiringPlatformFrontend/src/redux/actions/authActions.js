export const setAuthData = (isAuthenticated, candidate, employer, token) => ({
    type: 'SET_AUTH_DATA',
    payload: {isAuthenticated, candidate, employer, token},
});
