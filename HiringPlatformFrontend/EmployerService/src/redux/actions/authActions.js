export const setAuthData = (employer, token) => ({
    type: 'SET_AUTH_DATA',
    payload: {employer, token},
});
