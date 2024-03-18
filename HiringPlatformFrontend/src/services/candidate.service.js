import apiCandidate from "../util/apiCandidate";
import apiCandidatePermitAll from "../util/apiCandidatePermitAll";

class CandidateService {

    async getLoggedCandidate() {
        return apiCandidatePermitAll.get("/getLoggedUser")
    }

    async updateAccount(request) {
        return apiCandidate.post("/updateAccount", request)
    }

    async addCv(request) {
        return apiCandidate.post("/addCV", request)
    }

    async getCvListForCandidate(id) {
        return apiCandidate.get("/getCvListForCandidate/" + id)
    }

    async deleteCv(cvId) {
        return apiCandidate.post("/deleteCv/" + cvId)
    }

}

export default new CandidateService();