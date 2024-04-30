package com.hiringPlatform.common.service;

import com.hiringPlatform.common.exception.ReviewNotFoundException;
import com.hiringPlatform.common.model.Employer;
import com.hiringPlatform.common.model.Review;
import com.hiringPlatform.common.model.Role;
import com.hiringPlatform.common.model.User;
import com.hiringPlatform.common.model.request.AddReviewRequest;
import com.hiringPlatform.common.model.request.EditReviewRequest;
import com.hiringPlatform.common.model.response.ReviewResponse;
import com.hiringPlatform.common.repository.ReviewRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ReviewServiceTest {

    @InjectMocks
    ReviewService reviewService;
    @Mock
    ReviewRepository reviewRepository;
    @Mock
    UserService userService;
    @Mock
    EmployerService employerService;
    @Mock
    CandidateService candidateService;

    @Test
    public void testAddReviewWithoutParent() {
        // Given
        User user = buildUser();
        Employer employer = buildEmployer();
        Review review = buildReview();
        AddReviewRequest request = buildAddReviewRequest();
        ReviewResponse response = buildReviewResponse();

        // When
        when(userService.getUser(anyString())).thenReturn(user);
        when(employerService.getEmployer(anyString())).thenReturn(employer);
        when(reviewRepository.save(any(Review.class))).thenReturn(review);

        // Then
        ReviewResponse result = reviewService.addReview(request);
        assertEquals(result, response);
    }

    @Test
    public void testAddReviewWithParent() {
        // Given
        User user = buildUser();
        Employer employer = buildEmployer();
        Review review = buildReviewWithParent();
        AddReviewRequest request = buildAddReviewRequestWithParent();
        ReviewResponse response = buildReviewResponseWithParent();

        // When
        when(userService.getUser(anyString())).thenReturn(user);
        when(employerService.getEmployer(anyString())).thenReturn(employer);
        when(reviewRepository.findById(anyString())).thenReturn(Optional.of(review.getParrentReview()));
        when(reviewRepository.save(any(Review.class))).thenReturn(review);

        // Then
        ReviewResponse result = reviewService.addReview(request);
        assertEquals(result, response);
    }

    @Test
    public void testAddReviewWithParentError() {
        // Given
        User user = buildUser();
        Employer employer = buildEmployer();
        AddReviewRequest request = buildAddReviewRequestWithParent();

        // When
        when(userService.getUser(anyString())).thenReturn(user);
        when(employerService.getEmployer(anyString())).thenReturn(employer);
        when(reviewRepository.findById(anyString())).thenReturn(Optional.empty());

        // Then
        ReviewNotFoundException reviewNotFoundException = assertThrows(ReviewNotFoundException.class, () -> reviewService.addReview(request));
        assertEquals("Review parent not found", reviewNotFoundException.getMessage());
    }

    @Test
    public void testGetAllReviewsForEmployer() {
        // Given
        Employer employer = buildEmployer();
        Review review = buildReviewWithParent();
        ReviewResponse response = buildReviewResponseWithParent();

        // When
        when(reviewRepository.findReviewsByEmployerEmployerId(anyString())).thenReturn(List.of(review));
        when(employerService.getEmployer(anyString())).thenReturn(employer);

        // Then
        List<ReviewResponse> result = reviewService.getAllReviewsForEmployer("1");
        assertEquals(result, List.of(response));
    }

    @Test
    public void testEditReview() {
        // Given
        Employer employer = buildEmployer();
        Review review = buildReviewWithParent();
        ReviewResponse response = buildReviewResponseWithParent();
        EditReviewRequest request = new EditReviewRequest();
        request.setReviewId("1");
        request.setNewComment("comment");
        request.setNewGrade(5);

        // When
        when(reviewRepository.findById(anyString())).thenReturn(Optional.of(review));
        when(employerService.getEmployer(anyString())).thenReturn(employer);
        when(reviewRepository.save(any(Review.class))).thenReturn(review);

        // Then
        ReviewResponse result = reviewService.editReview(request);
        assertEquals(result, response);
    }

    @Test
    public void testEditReviewNotPresent() {
        // Given
        EditReviewRequest request = new EditReviewRequest();
        request.setReviewId("1");
        request.setNewComment("comment");
        request.setNewGrade(5);

        // When
        when(reviewRepository.findById(anyString())).thenReturn(Optional.empty());

        // Then
        ReviewResponse result = reviewService.editReview(request);
        assertNull(result);
    }

    @Test
    public void testDeleteReview() {
        // When
        when(reviewRepository.findById(anyString())).thenReturn(Optional.of(buildReview()));

        // Then
        Boolean result = reviewService.deleteReview("1");
        assertEquals(result, true);
    }

    @Test
    public void testDeleteReviewNotPresent() {
        // When
        when(reviewRepository.findById(anyString())).thenReturn(Optional.empty());

        // Then
        Boolean result = reviewService.deleteReview("1");
        assertEquals(result, false);
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

    private AddReviewRequest buildAddReviewRequestWithParent(){
        AddReviewRequest request = new AddReviewRequest();
        request.setUserId("1");
        request.setEmployerId("1");
        request.setParentReviewId("1");
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

    private Review buildReviewWithParent(){
        Review review = new Review();
        review.setReviewId("1");
        review.setUser(buildUser());
        review.setEmployer(buildEmployer());
        review.setComment("comment");
        review.setGrade(5);
        review.setCommentDate(new Date(2000));
        review.setParrentReview(buildReview());
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
