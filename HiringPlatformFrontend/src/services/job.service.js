import apiCandidate from "../util/apiCandidate";
import apiEmployer from "../util/apiEmployer";

class JobService {

    async getAllJobs() {
        return apiCandidate.get("/getAllJobs")
    }

    async getNrJobsForEmployer(employerId) {
        return apiEmployer.get("/getNrJobsForEmployer/" + employerId)
    }

    async getAllStages() {
        return apiEmployer.get("/getAllStages");
    }

    async addJob(request) {
        return apiEmployer.post("/addJob", request);
    }

    async closeJob(jobId) {
        return apiEmployer.post("/closeJob/" + jobId);
    }

    async getAllJobsForEmployer(employerId) {
        return apiEmployer.get("/getAllJobsForEmployer/" + employerId)
    }

    async updateJobDescription(request) {
        return apiEmployer.post("/updateJobDescription", request);
    }

    async getStagesForJob(jobId) {
        return apiEmployer.get("/getStagesForJob/" + jobId);
    }

    async getRecommendedJobs(candidateId) {
        console.log(candidateId)
        return apiCandidate.get("/getRecommendedJobs/" + candidateId);
    }
}

export default new JobService();