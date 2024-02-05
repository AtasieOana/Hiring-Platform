import apiToken from "../util/apiToken";

class ProfileService {

    async hasEmployerProfile(token, email) {
        return apiToken.get("/hasEmployerProfile/" + email);
    }

}

export default new ProfileService();