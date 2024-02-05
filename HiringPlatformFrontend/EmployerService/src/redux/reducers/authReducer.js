// authReducer.js

const initialState = {
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
    console.log(state)
    switch (action.type) {
        case 'SET_AUTH_DATA':
            return {
                ...state,
                employer: action.payload.employer,
                token: action.payload.token,
            };
        default:
            return state;
    }
};

export default authReducer;
