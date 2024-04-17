import apiEmployer from "../util/apiEmployer";
import apiEmployerPermitAll from "../util/apiEmployerPermitAll";

class EmployerService {

    async getLoggedEmployer() {
        return apiEmployerPermitAll.get("/getLoggedUser")
    }

    async updateAccount(request) {
        return apiEmployer.post("/updateAccount", request)
    }

    async getAppsPerDayByEmployer(empId) {
        return apiEmployer.get("/getAppsPerDayByEmployer/" + empId)
    }

    async getAppsPerJobByEmployer(empId) {
        return apiEmployer.get("/getAppsPerJobByEmployer/" + empId)
    }

    async getAppsStatusNumbers(empId) {
        return apiEmployer.get("/getAppsStatusNumbers/" + empId)
    }

}

export default new EmployerService();