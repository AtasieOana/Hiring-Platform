package com.hiringPlatform.common.controller.UnitTests;

import com.hiringPlatform.common.controller.ReviewController;
import com.hiringPlatform.common.model.Employer;
import com.hiringPlatform.common.model.Review;
import com.hiringPlatform.common.model.Role;
import com.hiringPlatform.common.model.User;
import com.hiringPlatform.common.model.request.AddReviewRequest;
import com.hiringPlatform.common.model.request.EditReviewRequest;
import com.hiringPlatform.common.model.response.ReviewResponse;
import com.hiringPlatform.common.service.ReviewService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ReviewControllerTest {

    @InjectMocks
    ReviewController reviewController;
    @Mock
    ReviewService reviewService;

    @Test
    public void testAddReview() {
        // Given
        AddReviewRequest request = buildAddReviewRequest();
        ReviewResponse response = buildReviewResponse();

        // When
        when(reviewService.addReview(request)).thenReturn(response);

        // Then
        ResponseEntity<ReviewResponse> result = reviewController.addReview(request);
        assertEquals(result.getBody(), response);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testGetAllReviewsForEmployer() {
        // Given
        ReviewResponse response = buildReviewResponseWithParent();

        // When
        when(reviewService.getAllReviewsForEmployer(anyString())).thenReturn(List.of(response));

        // Then
        ResponseEntity<List<ReviewResponse>> result = reviewController.getReviewsForEmployer("1");
        assertEquals(result.getBody(), List.of(response));
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testEditReview() {
        // Given
        ReviewResponse response = buildReviewResponseWithParent();
        EditReviewRequest request = new EditReviewRequest();
        request.setReviewId("1");
        request.setNewComment("comment");
        request.setNewGrade(5);

        // When
        when(reviewService.editReview(request)).thenReturn(response);

        // Then
        ResponseEntity<ReviewResponse> result = reviewController.editReview(request);
        assertEquals(result.getBody(), response);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testDeleteReview() {
        // When
        when(reviewService.deleteReview(anyString())).thenReturn(true);

        // Then
        ResponseEntity<Boolean> result = reviewController.deleteReview("1");
        assertEquals(result.getBody(), true);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    private Employer buildEmployer(){
        Employer employer = new Employer();
        User user = new User();
        user.setUserId("1");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        Role role = new Role("1", "ROLE_EMPLOYER", "description");
        user.setUserRole(role);
        String company = "test";
        employer.setUserDetails(user);
        employer.setCompanyName(company);
        employer.setEmployerId("1");
        return employer;
    }

    private AddReviewRequest buildAddReviewRequest(){
        AddReviewRequest request = new AddReviewRequest();
        request.setUserId("1");
        request.setEmployerId("1");
        request.setParentReviewId("");
        request.setComment("comment");
        request.setGrade(5);
        return request;
    }

    private Review buildReview(){
        Review review = new Review();
        review.setReviewId("1");
        review.setUser(buildUser());
        review.setEmployer(buildEmployer());
        review.setComment("comment");
        review.setGrade(5);
        review.setCommentDate(new Date(2000));
        return review;
    }

    private ReviewResponse buildReviewResponse(){
        ReviewResponse review = new ReviewResponse();
        review.setReviewId("1");
        review.setEmployerId("1");
        review.setComment("comment");
        review.setCommentDate(new Date(2000));
        review.setUserId("1");
        review.setUserEmail("test@example.com");
        review.setUserName("test");
        review.setUserRole("ROLE_EMPLOYER");
        review.setParentReviewId("");
        review.setGrade(5);
        return review;
    }

    private ReviewResponse buildReviewResponseWithParent(){
        ReviewResponse review = new ReviewResponse();
        review.setReviewId("1");
        review.setEmployerId("1");
        review.setComment("comment");
        review.setCommentDate(new Date(2000));
        review.setUserId("1");
        review.setUserEmail("test@example.com");
        review.setUserName("test");
        review.setUserRole("ROLE_EMPLOYER");
        review.setParentReviewId("1");
        review.setGrade(5);
        return review;
    }

    private User buildUser(){
        User user = new User();
        user.setUserId("1");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        Role role = new Role("1", "ROLE_EMPLOYER", "description");
        user.setUserRole(role);
        return user;
    }

}
