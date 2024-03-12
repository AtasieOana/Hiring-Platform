import {combineReducers} from 'redux';
import authReducer from "./reducers/authReducer";
import jobReducer from "./reducers/jobReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    job: jobReducer,
    // Add other reducers if it's the case
});


export default rootReducer;
