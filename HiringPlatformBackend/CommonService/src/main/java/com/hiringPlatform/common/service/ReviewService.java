package com.hiringPlatform.common.service;

import com.hiringPlatform.common.exception.ReviewNotFoundException;
import com.hiringPlatform.common.model.Candidate;
import com.hiringPlatform.common.model.Employer;
import com.hiringPlatform.common.model.Review;
import com.hiringPlatform.common.model.User;
import com.hiringPlatform.common.model.request.AddReviewRequest;
import com.hiringPlatform.common.model.request.EditReviewRequest;
import com.hiringPlatform.common.model.response.ReviewResponse;
import com.hiringPlatform.common.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserService userService;
    private final EmployeeService employeeService;
    private final CandidateService candidateService;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, UserService userService,
                         EmployeeService employeeService, CandidateService candidateService) {
        this.reviewRepository = reviewRepository;
        this.userService = userService;
        this.employeeService = employeeService;
        this.candidateService = candidateService;
    }

    public ReviewResponse addReview(AddReviewRequest addReviewRequest){
        Review review = new Review();
        review.setComment(addReviewRequest.getComment());
        review.setGrade(addReviewRequest.getGrade());
        User user = userService.getUser(addReviewRequest.getUserId());
        review.setUser(user);
        Employer employer = employeeService.getEmployer(addReviewRequest.getEmployerId());
        review.setEmployer(employer);
        review.setCommentDate(new Date());
        if(!Objects.equals(addReviewRequest.getParentReviewId(), "") && addReviewRequest.getParentReviewId() != null){
            Optional<Review> reviewParentOptional = reviewRepository.findById(addReviewRequest.getParentReviewId());
            if(reviewParentOptional.isPresent()){
                Review reviewParent =  reviewParentOptional.get();
                review.setParrentReview(reviewParent);
            }
            else{
                throw new ReviewNotFoundException("Review parent not found");
            }
        }
        else{
            review.setParrentReview(null);
        }
        return buildReviewResponse(reviewRepository.save(review));
    }
    public List<ReviewResponse> getAllReviewsForEmployer(String employerId){
        return reviewRepository.findReviewsByEmployerEmployerId(employerId)
                .stream().map(this::buildReviewResponse).toList();
    }

    public ReviewResponse editReview(EditReviewRequest request){
        Optional<Review> reviewOptional = reviewRepository.findById(request.getReviewId());
        if (reviewOptional.isPresent()) {
            Review review = reviewOptional.get();
            review.setComment(request.getNewComment());
            review.setGrade(request.getNewGrade());
            return buildReviewResponse(reviewRepository.save(review));
        }
        return null;
    }

    public Boolean deleteReview(String reviewId){
        Optional<Review> reviewOptional = reviewRepository.findById(reviewId);
        if (reviewOptional.isPresent()) {
            reviewRepository.delete(reviewOptional.get());
            return true;
        }
        else{
            return false;
        }
    }

    private ReviewResponse buildReviewResponse(Review review){
        ReviewResponse reviewResponse = new ReviewResponse();
        reviewResponse.setReviewId(review.getReviewId());
        reviewResponse.setComment(review.getComment());
        reviewResponse.setGrade(review.getGrade());
        reviewResponse.setCommentDate(review.getCommentDate());
        reviewResponse.setUserId(review.getUser().getUserId());
        reviewResponse.setUserEmail(review.getUser().getEmail());
        reviewResponse.setUserRole(review.getUser().getUserRole().getRoleName());
        if(review.getParrentReview() == null){
            reviewResponse.setParentReviewId("");
        }
        else{
            reviewResponse.setParentReviewId(review.getParrentReview().getReviewId());
        }
        reviewResponse.setEmployerId(review.getEmployer().getEmployerId());
        // Choose review name
        String name = "";
        if(Objects.equals(review.getUser().getUserRole().getRoleName(), "ROLE_EMPLOYER")){
            Employer employer = employeeService.getEmployer(review.getUser().getUserId());
            name = employer.getCompanyName();
        }
        else{
            Candidate candidate = candidateService.getCandidate(review.getUser().getUserId());
            name = candidate.getFirstname() + " " + candidate.getLastname();
        }
        reviewResponse.setUserName(name);
        return reviewResponse;
    }
}
