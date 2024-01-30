import api from "../util/api";

class AuthenticationService {

    async register(registerRequest) {
        return api.post("/signUp", registerRequest)
    }

    async checkToken(email, token) {
        return api.get("/checkToken/" + email + "/" + token);
    }

    async login(email, password) {
        return api.get("/login/" + email + "/" + password);
    }
}

export default new AuthenticationService();