import api from "../util/api";

class AuthenticationService {

    async register(registerRequest){
        return api.post("/signUp", registerRequest)
    }
}

export default new AuthenticationService();