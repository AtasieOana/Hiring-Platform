import apiAdmin from "../util/apiAdmin";

class ChartService {
  async getJobCategoryDistribution() {
    return apiAdmin.get("/getJobCategoryDistribution");
  }

  async getApplicationStatusPercentage() {
    return apiAdmin.get("/getApplicationStatusPercentage");
  }

  async getJobsExperiencePercentage() {
    return apiAdmin.get("/getJobsExperiencePercentage");
  }

  async getApplicationsPerDate() {
    return apiAdmin.get("/getApplicationsPerDate");
  }

  async getTopEmployersWithApplications() {
    return apiAdmin.get("/getTopEmployersWithApplications");
  }

  async getOverview() {
    return apiAdmin.get("/getOverview");
  }

  async getAccountCreationTrend() {
    return apiAdmin.get("/getAccountCreationTrend");
  }
}

export default new ChartService();
