import {combineReducers} from 'redux';
import authReducer from "./reducers/authReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    // Add other reducers if it's the case
});


export default rootReducer;
