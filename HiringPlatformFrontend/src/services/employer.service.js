import apiEmployer from "../util/apiEmployer";
import apiEmployerPermitAll from "../util/apiEmployerPermitAll";

class EmployerService {

    async getLoggedEmployer() {
        return apiEmployerPermitAll.get("/getLoggedUser")
    }

    async updateAccount(request) {
        return apiEmployer.post("/updateAccount", request)
    }
}

export default new EmployerService();