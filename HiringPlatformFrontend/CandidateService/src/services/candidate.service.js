import apiToken from "../util/apiToken";
import apiTokenMultipart from "../util/apiTokenMultipart";

class CandidateService {

    async updateAccount(request) {
        return apiToken.post("/updateAccount", request)
    }

    async addCv(request) {
        return apiToken.post("/addCV", request)
    }

    async getCvListForCandidate(id) {
        return apiToken.get("/getCvListForCandidate/" + id)
    }

    async deleteCv(cvId) {
        return apiToken.post("/deleteCv/" + cvId)
    }

}

export default new CandidateService();