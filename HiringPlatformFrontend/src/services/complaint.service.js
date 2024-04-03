import apiAdmin from "../util/apiAdmin";

class ComplaintService {

    async updateComplaintStatus(request) {
        return apiAdmin.post("/updateComplaintStatus", request);
    }

    async addComplaint(request) {
        return apiAdmin.post("/addComplaint", request);
    }

    async getAllComplaints() {
        return apiAdmin.get("/getAllComplaints");
    }
}

export default new ComplaintService();