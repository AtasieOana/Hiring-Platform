package com.hiringPlatform.common.controller;

import com.hiringPlatform.common.model.request.AddReviewRequest;
import com.hiringPlatform.common.model.request.EditReviewRequest;
import com.hiringPlatform.common.model.request.ReviewResponse;
import com.hiringPlatform.common.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/getReviewsForEmployer/{employerId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsForEmployer(@PathVariable String employerId) {
        List<ReviewResponse> list = reviewService.getAllReviewsForEmployer(employerId);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/addReview")
    public ResponseEntity<ReviewResponse> addReview(@RequestBody AddReviewRequest request) {
        ReviewResponse review = reviewService.addReview(request);
        return ResponseEntity.ok(review);
    }

    @PostMapping("/editReview")
    public ResponseEntity<ReviewResponse> editReview(@RequestBody EditReviewRequest request) {
        ReviewResponse review = reviewService.editReview(request);
        return ResponseEntity.ok(review);
    }

    @PostMapping("/deleteReview/{reviewId}")
    public ResponseEntity<Boolean> deleteReview(@PathVariable String reviewId) {
        Boolean result = reviewService.deleteReview(reviewId);
        return ResponseEntity.ok(result);
    }
}
