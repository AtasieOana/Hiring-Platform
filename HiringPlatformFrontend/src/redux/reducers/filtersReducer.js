const initialState = {
  filtersForJobs: {
    contractType: [],
    employmentRegime: [],
    experience: [],
    industry: "",
    workMode: [],
    cityName: "",
    postingDate: "",
    status: [],
  },
  sortDateForJobs: 0,
  viewsForJob: false,
  recommendedJobs: [],
  currentPage: 0,
};

const jobReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_FILTER_DATA":
      return {
        ...state,
        filtersForJobs: action.payload.filtersForJobs,
        sortDateForJobs: action.payload.sortDateForJobs,
        viewsForJob: action.payload.viewsForJob,
        recommendedJobs: action.payload.recommendedJobs,
        currentPage: action.payload.currentPage,
      };
    case "REMOVE_FILTER_DATA":
      return {
        ...state,
        filtersForJobs: initialState.filtersForJobs,
        sortDateForJobs: initialState.sortDateForJobs,
        viewsForJob: initialState.viewsForJob,
        recommendedJobs: initialState.recommendedJobs,
        currentPage: initialState.currentPage,
      };
    default:
      return state;
  }
};

export default jobReducer;
