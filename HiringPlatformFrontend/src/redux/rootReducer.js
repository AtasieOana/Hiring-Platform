import { combineReducers } from "redux";
import authReducer from "./reducers/authReducer";
import jobReducer from "./reducers/jobReducer";
import cvReducer from "./reducers/cvReducer";
import profileReducer from "./reducers/profileReducer";
import adminReducer from "./reducers/adminReducer";
import addressReducer from "./reducers/addressReducer";
import filtersReducer from "./reducers/filtersReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  job: jobReducer,
  cv: cvReducer,
  profile: profileReducer,
  admin: adminReducer,
  address: addressReducer,
  filters: filtersReducer,
});

export default rootReducer;
