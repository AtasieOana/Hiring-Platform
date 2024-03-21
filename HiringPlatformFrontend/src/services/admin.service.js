import apiAuth from "../util/apiAuth";

class AdminService {

    async loginAdmin(email, password) {
        return apiAuth.get("/loginAdmin/" + email + "/" + password);
    }


}

export default new AdminService();