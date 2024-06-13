import apiCandidate from "../util/apiCandidate";
import apiCommonPermitAll from "../util/apiCommonPermitAll";

class CandidateService {
  async getLoggedCandidate() {
    return apiCommonPermitAll.get("/getLoggedUser");
  }

  async updateAccount(request) {
    return apiCandidate.post("/updateAccount", request);
  }

  async addCv(request) {
    return apiCandidate.post("/addCV", request);
  }

  async getCvListForCandidate(id) {
    return apiCandidate.get("/getCvListForCandidate/" + id);
  }

  async deleteCv(cvId) {
    return apiCandidate.post("/deleteCv/" + cvId);
  }

  async getJobsPublishedPerDay() {
    return apiCandidate.get("/getJobsPublishedPerDay");
  }

  async getApplicationStatusNumbers(candidateId) {
    return apiCandidate.get("/getApplicationStatusNumbers/" + candidateId);
  }

  async getApplicationViewedNumbers(candidateId) {
    return apiCandidate.get("/getApplicationViewedNumbers/" + candidateId);
  }
}

export default new CandidateService();
