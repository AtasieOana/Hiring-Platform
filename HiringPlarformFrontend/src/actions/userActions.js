export const login = (loggedUser) => ({
    type: 'LOG_IN',
    payload: {
        token: loggedUser.token,
        role: loggedUser.role,
        username: loggedUser.username,
    },
});

export const logout = () => ({
    type: 'LOG_OUT',
});