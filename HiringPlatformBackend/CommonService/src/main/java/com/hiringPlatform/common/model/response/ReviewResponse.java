package com.hiringPlatform.common.model.request;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponse {

    private String reviewId;
    private String comment;
    private Integer grade;
    private Date commentDate;
    private String userId;
    private String userEmail;
    private String userName;
    private String userRole;
    private String employerId;
    private String parentReviewId;
}
