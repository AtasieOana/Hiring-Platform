import apiAuth from "../util/apiAuth";

class AuthenticationService {
    async logout() {
        return apiAuth.get("/logoutUser")
    }

    async deleteAccount(email) {
        return apiAuth.delete("/deleteUser/" + email)
    }

    async registerCandidate(registerRequest) {
        return apiAuth.post("/signUpCandidate", registerRequest)
    }

    async registerEmployer(registerRequest) {
        return apiAuth.post("/signUpEmployer", registerRequest)
    }

    async checkToken(email, token) {
        return apiAuth.get("/checkToken/" + email + "/" + token);
    }

    async login(email, password) {
        return apiAuth.get("/login/" + email + "/" + password);
    }

    async forgotPassword(email, password) {
        return apiAuth.get("/forgotPassword/" + email);
    }

    async resetPassword(request) {
        return apiAuth.post("/resetPassword", request);
    }

    async authGoogle(request) {
        return apiAuth.post("/authGoogle", request);
    }

    async loginGoogle(request) {
        return apiAuth.post("/loginGoogle", request);
    }
}

export default new AuthenticationService();