import apiToken from "../util/apiToken";
import apiTokenMultipart from "../util/apiTokenMultipart";

class ApplicationService {

    async applyToJob(request) {
        return apiToken.post("/applyToJob", request)
    }

    async getAllApplicationsForCandidate(candidateId) {
        return apiToken.get("/getAllApplicationsForCandidate/" + candidateId)
    }

    async refuseApplication(request) {
        return apiToken.post("/refuseApplication", request)
    }

    async checkApplication(candidateId, jobId) {
        return apiToken.get("/checkApplication/" + candidateId + "/" + jobId)
    }

    async addAnswersForQuestions(request) {
        return apiToken.post("/addAnswersForQuestions", request)
    }
}

export default new ApplicationService();