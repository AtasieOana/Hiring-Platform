import {combineReducers} from 'redux';
import authReducer from "./reducers/authReducer";
import jobReducer from "./reducers/jobReducer";
import profileReducer from "./reducers/profileReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    job: jobReducer,
    profile: profileReducer,
    // Add other reducers if it's the case
});


export default rootReducer;
