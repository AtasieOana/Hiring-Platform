import apiAuth from "../util/apiAuth";
import apiAdmin from "../util/apiAdmin";

class AdminService {

    async loginAdmin(email, password) {
        return apiAuth.get("/loginAdmin/" + email + "/" + password);
    }

    async getUserList() {
        return apiAdmin.get("/getUserList");
    }

    async editAdmin(request) {
        return apiAdmin.post("/editAdmin", request);
    }

    async addAdmin(request) {
        return apiAdmin.post("/addAdmin", request);
    }

    async deleteAdmin(newCreatorEmail, adminEmailToBeDeleted) {
        return apiAdmin.post("/deleteAdmin/" + newCreatorEmail + "/" + adminEmailToBeDeleted);
    }

    async getAdmin(adminId) {
        return apiAdmin.get("/getAdmin/" + adminId);
    }
}

export default new AdminService();