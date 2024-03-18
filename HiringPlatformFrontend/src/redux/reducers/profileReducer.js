// authReducer.js

const initialState = {
    hasProfile: false,
};

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PROFILE_DATA':
            return {
                ...state,
                hasProfile: action.payload.hasProfile
            };
        default:
            return state;
    }
};

export default profileReducer;
