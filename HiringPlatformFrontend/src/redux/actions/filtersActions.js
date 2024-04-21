export const setFilterData = (
  filtersForJobs,
  sortDateForJobs,
  viewsForJob,
  recommendedJobs,
  currentPage,
) => ({
  type: "SET_FILTER_DATA",
  payload: {
    filtersForJobs,
    sortDateForJobs,
    viewsForJob,
    recommendedJobs,
    currentPage,
  },
});

export const removeFilterData = () => ({
  type: "REMOVE_FILTER_DATA",
  payload: {},
});
