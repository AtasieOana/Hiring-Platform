// authReducer.js

const initialState = {
    isAuthenticated: false,
    employer: {
        employerId: "",
        companyName: "",
        userDetails: {
            email: '',
            userId: '',
            password: '',
            registrationDate: null,
            accountEnabled: 1,
            userRole: {
                roleId: "",
                roleName: "",
                roleDescription: ""
            }
        }
    },
    token: "",
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_AUTH_DATA':
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
                employer: action.payload.employer,
                token: action.payload.token,
            };
        default:
            return state;
    }
};

export default authReducer;
