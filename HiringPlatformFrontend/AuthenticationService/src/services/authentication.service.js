import axios from "axios";

class AuthenticationService {

    async register(registerRequest){
        return axios.post("/signUp", registerRequest)
    }
}

export default new AuthenticationService();