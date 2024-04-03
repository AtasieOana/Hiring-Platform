import apiAdmin from "../util/apiAdmin";
import apiCommon from "../util/apiCommon";

class MessageService {

    async addMessage(request) {
        return apiCommon.post("/addMessage", request);
    }

    async getMessagesForUser(userId) {
        return apiCommon.get("/getMessagesForUser/" + userId);
    }

    async getAllMappedUserExceptUser(email) {
        return apiCommon.get("/getAllMappedUserExceptUser/" + email);
    }

    async markAsSeen(receiverMail, senderMail) {
        return apiCommon.post("/markAsSeen/" + receiverMail + "/" + senderMail);
    }
}

export default new MessageService();