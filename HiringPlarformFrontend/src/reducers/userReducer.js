const initialState = {
    token: null,
    role: null,
    username: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOG_IN':
            return {
                ...state,
                token: action.payload.token,
                role: action.payload.role,
                username: action.payload.username,
            };
        case 'LOG_OUT':
            return initialState;
        default:
            return state;
    }
};

export default userReducer;