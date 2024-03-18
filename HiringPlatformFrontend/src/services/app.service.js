import apiCandidate from "../util/apiCandidate";
import apiEmployer from "../util/apiEmployer";

class ApplicationService {

    async applyToJob(request) {
        return apiCandidate.post("/applyToJob", request)
    }

    async getAllApplicationsForCandidate(candidateId) {
        return apiCandidate.get("/getAllApplicationsForCandidate/" + candidateId)
    }

    async refuseApplicationCandidate(request) {
        return apiCandidate.post("/refuseApplication", request)
    }

    async checkApplication(candidateId, jobId) {
        return apiCandidate.get("/checkApplication/" + candidateId + "/" + jobId)
    }

    async addAnswersForQuestions(request) {
        return apiCandidate.post("/addAnswersForQuestions", request)
    }

    async getAllApplicationsForJob(jobId) {
        return apiEmployer.get("/getAllApplicationsForJob/" + jobId);
    }

    async refuseApplicationEmployer(request) {
        return apiEmployer.post("/refuseApplication", request);
    }

    async setNextStage(request) {
        return apiEmployer.post("/setNextStage", request);
    }
}

export default new ApplicationService();