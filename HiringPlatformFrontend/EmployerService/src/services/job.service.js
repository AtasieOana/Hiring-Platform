import apiToken from "../util/apiToken";
import apiTokenMultipart from "../util/apiTokenMultipart";

class JobService {

    async getAllStages() {
        return apiToken.get("/getAllStages");
    }

    async addJob(request) {
        return apiTokenMultipart.post("/addJob", request);
    }

    async deleteJob(jobId) {
        return apiToken.delete("/deleteJob/" + jobId);
    }

    async getAllJobsForEmployer(employerId) {
        return apiToken.get("/getAllJobsForEmployer/" + employerId)
    }

    async getProfile(email) {
        return apiToken.get("/getProfile/" + email)
    }

}

export default new JobService();