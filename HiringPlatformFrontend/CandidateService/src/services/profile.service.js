import apiToken from "../util/apiToken";
import apiTokenMultipart from "../util/apiTokenMultipart";

class ProfileService {

    async updateAccount(request) {
        return apiToken.post("/updateAccount", request)
    }

    async getProfile(email) {
        return apiToken.get("/getProfile/" + email)
    }

}

export default new ProfileService();