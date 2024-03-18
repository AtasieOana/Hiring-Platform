// authReducer.js

const initialState = {
    hasCv: false,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CV_DATA':
            return {
                ...state,
                hasCv: action.payload.hasCv
            };
        default:
            return state;
    }
};

export default authReducer;
