import apiCommon from "../util/apiCommon";

class ReviewService {

    async addReview(request) {
        return apiCommon.post("/addReview", request)
    }

    async getReviewsForEmployer(employerId) {
        return apiCommon.get("/getReviewsForEmployer/" + employerId)
    }

    async editReview(request) {
        return apiCommon.post("/editReview", request)
    }

    async deleteReview(reviewId) {
        return apiCommon.post("/deleteReview/" + reviewId)
    }
}

export default new ReviewService();