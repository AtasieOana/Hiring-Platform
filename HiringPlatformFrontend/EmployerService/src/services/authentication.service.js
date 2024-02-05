import api from "../util/api";

class AuthenticationService {

    async getLoggedUser() {
        return api.get("/getLoggedUser")
    }

}

export default new AuthenticationService();