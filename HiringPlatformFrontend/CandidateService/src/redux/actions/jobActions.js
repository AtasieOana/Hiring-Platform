export const setJobData = (jobDetails) => ({
    type: 'SET_OPEN_JOB_DATA',
    payload: {jobDetails},
});

export const removeJobData = () => ({
    type: 'REMOVE_OPEN_JOB_DATA',
    payload: {},
});
