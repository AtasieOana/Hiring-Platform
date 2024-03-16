import apiToken from "../util/apiToken";
import apiTokenMultipart from "../util/apiTokenMultipart";

class JobService {

    async getAllJobs() {
        return apiToken.get("/getAllJobs")
    }

    async getNrJobsForEmployer(employerId) {
        return apiToken.get("/getNrJobsForEmployer/" + employerId)
    }
}

export default new JobService();