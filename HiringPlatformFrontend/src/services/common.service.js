import apiCommon from "../util/apiCommon";

class CommonService {
    async getAllCitiesByRegions() {
        return apiCommon.get("/getAllCitiesByRegions");
    }
}

export default new CommonService();