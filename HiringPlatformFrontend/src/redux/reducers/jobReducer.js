// authReducer.js

const initialState = {
    jobDetails:{
        jobId: "",
        title: "",
        description: "",
        contractType: "",
        employmentRegime: "",
        experience: "",
        industry: "",
        workMode: "",
        postingDate: null,
        cityName: "",
        regionName: "",
        countryName: "",
        employerId: "",
        questions: [],
        stages: [],
        employer:{
            employerId: "",
            companyName: "",
            userDetails: {
                userId: "",
                email: "",
                password: "",
                registrationDate: null,
                accountEnabled: 1,
            }
        },
        employerProfile:{
            imagine: "",
            description: "",
            phone: "",
            site: "",
            street: "",
            zipCode: "",
            cityName: "",
            regionName: "",
            countryName: "",
        }
    }
};

const jobReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_OPEN_JOB_DATA':
            return {
                ...state,
                jobDetails: action.payload.jobDetails,
            };
        case 'REMOVE_OPEN_JOB_DATA':
            return {
                ...state,
                jobDetails: initialState.jobDetails,
            };
        default:
            return state;
    }
};

export default jobReducer;
