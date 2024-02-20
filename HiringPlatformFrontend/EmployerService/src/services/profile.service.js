import apiToken from "../util/apiToken";
import apiTokenMultipart from "../util/apiTokenMultipart";

class ProfileService {

    async hasEmployerProfile(email) {
        return apiToken.get("/hasEmployerProfile/" + email);
    }

    async addEmployerProfile(request) {
        return apiTokenMultipart.post("/addEmployerProfile", request);
    }

    async updateAccount(request) {
        return apiToken.post("/updateAccount", request)
    }

    async getProfile(email) {
        return apiToken.get("/getProfile/" + email)
    }

}

export default new ProfileService();