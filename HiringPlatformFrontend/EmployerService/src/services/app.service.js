import apiToken from "../util/apiToken";

class JobService {

    async getAllApplicationsForJob(jobId) {
        return apiToken.get("/getAllApplicationsForJob/" + jobId);
    }

    async refuseApplication(request) {
        return apiToken.post("/refuseApplication", request);
    }

    async setNextStage(request) {
        return apiToken.post("/setNextStage", request);
    }

}

export default new JobService();