import apiEmployer from "../util/apiEmployer";
import apiEmployerMultipart from "../util/apiEmployerMultipart";

class ProfileService {

    async getProfile(email) {
        return apiEmployer.get("/getProfile/" + email)
    }

    async addEmployerProfile(request) {
        return apiEmployerMultipart.post("/addEmployerProfile", request);
    }

    async updateEmployerProfile(request) {
        return apiEmployerMultipart.post("/updateEmployerProfile", request);
    }

}

export default new ProfileService();