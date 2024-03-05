import apiToken from "../util/apiToken";

class JobService {

    async getAllStages() {
        return apiToken.get("/getAllStages");
    }

    async addJob(request) {
        return apiToken.post("/addJob", request);
    }

    async deleteJob(jobId) {
        return apiToken.delete("/deleteJob/" + jobId);
    }

    async getAllJobsForEmployer(employerId) {
        return apiToken.get("/getAllJobsForEmployer/" + employerId)
    }

    async getNrJobsForEmployer(employerId) {
        return apiToken.get("/getNrJobsForEmployer/" + employerId)
    }

}

export default new JobService();