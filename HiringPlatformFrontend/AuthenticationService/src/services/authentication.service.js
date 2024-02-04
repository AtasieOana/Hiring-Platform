import api from "../util/api";

class AuthenticationService {

    async registerCandidate(registerRequest) {
        return api.post("/signUpCandidate", registerRequest)
    }

    async registerEmployer(registerRequest) {
        return api.post("/signUpEmployer", registerRequest)
    }

    async checkToken(email, token) {
        return api.get("/checkToken/" + email + "/" + token);
    }

    async login(email, password) {
        return api.get("/login/" + email + "/" + password);
    }

    async forgotPassword(email, password) {
        return api.get("/forgotPassword/" + email);
    }

    async resetPassword(request) {
        return api.post("/resetPassword", request);
    }

    async authGoogle(request) {
        return api.post("/authGoogle", request);
    }

    async loginGoogle(request) {
        return api.post("/loginGoogle", request);
    }
}

export default new AuthenticationService();