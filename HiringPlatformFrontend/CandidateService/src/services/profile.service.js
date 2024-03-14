import apiToken from "../util/apiToken";
import apiTokenMultipart from "../util/apiTokenMultipart";

class ProfileService {

    async getProfile(email) {
        return apiToken.get("/getProfile/" + email)
    }

}

export default new ProfileService();