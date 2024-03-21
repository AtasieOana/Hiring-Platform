// authReducer.js

const initialState = {
    isAuthenticated: false,
    admin: {
        adminId: "",
        username: "",
        firstname: "",
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
        },
        creatorUser:{
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

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ADMIN_DATA':
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
                admin: action.payload.admin,
                token: action.payload.token,
            };
        default:
            return state;
    }
};

export default adminReducer;
