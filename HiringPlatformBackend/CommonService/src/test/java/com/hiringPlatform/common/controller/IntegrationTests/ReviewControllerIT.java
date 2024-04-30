package com.hiringPlatform.common.controller.IntegrationTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiringPlatform.common.controller.ReviewController;
import com.hiringPlatform.common.model.request.AddReviewRequest;
import com.hiringPlatform.common.model.request.EditReviewRequest;
import com.hiringPlatform.common.model.response.ReviewResponse;
import com.hiringPlatform.common.security.JwtService;
import com.hiringPlatform.common.service.RedisService;
import com.hiringPlatform.common.service.ReviewService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(controllers = ReviewController.class)
@ContextConfiguration(classes = {JwtService.class, RedisService.class})
@WithMockUser
@ActiveProfiles("test")
@Import(ReviewController.class)
public class ReviewControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    ReviewService reviewService;

    @MockBean
    JwtService jwtService;

    @MockBean
    RedisService redisService;

    @Test
    public void testAddReview() throws Exception {
        // Given
        AddReviewRequest request = buildAddReviewRequest();
        ReviewResponse response = buildReviewResponse();

        // When
        when(reviewService.addReview(request)).thenReturn(response);

        // Then
        mockMvc.perform(post("/addReview").contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(response)));
    }

    @Test
    public void testGetAllReviewsForEmployer() throws Exception {
        // Given
        ReviewResponse response = buildReviewResponseWithParent();

        // When
        when(reviewService.getAllReviewsForEmployer(anyString())).thenReturn(List.of(response));

        // Then
        mockMvc.perform(get("/getReviewsForEmployer/1"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(List.of(response))));
    }

    @Test
    public void testEditReview() throws Exception {
        // Given
        ReviewResponse response = buildReviewResponseWithParent();
        EditReviewRequest request = new EditReviewRequest();
        request.setReviewId("1");
        request.setNewComment("comment");
        request.setNewGrade(5);

        // When
        when(reviewService.editReview(request)).thenReturn(response);

        // Then
        mockMvc.perform(post("/editReview").contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(response)));
    }

    @Test
    public void testDeleteReview() throws Exception {
        // When
        when(reviewService.deleteReview(anyString())).thenReturn(true);

        // Then
        mockMvc.perform(post("/deleteReview/1").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(true)));
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

}
