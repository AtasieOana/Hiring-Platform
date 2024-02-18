import api from "../util/api";
import apiAuth from "../util/apiAuth";

class AuthenticationService {

    async getLoggedUser() {
        return api.get("/getLoggedUser")
    }

    async logout() {
        return apiAuth.get("/logoutUser")
    }
}

export default new AuthenticationService();