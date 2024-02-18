import apiToken from "../util/apiToken";

class ProfileService {

    async hasEmployerProfile(email) {
        return apiToken.get("/hasEmployerProfile/" + email);
    }

    async addEmployerProfile(request) {
        return apiToken.post("/addEmployerProfile", request);
    }

}

export default new ProfileService();