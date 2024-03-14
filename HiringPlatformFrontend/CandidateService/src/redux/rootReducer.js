import {combineReducers} from 'redux';
import authReducer from "./reducers/authReducer";
import jobReducer from "./reducers/jobReducer";
import cvReducer from "./reducers/cvReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    job: jobReducer,
    cv: cvReducer,
    // Add other reducers if it's the case
});


export default rootReducer;
