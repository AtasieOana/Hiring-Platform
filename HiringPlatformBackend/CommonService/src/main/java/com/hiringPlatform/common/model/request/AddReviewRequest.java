package com.hiringPlatform.common.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddReviewRequest {

    private String userId;
    private String employerId;
    private String comment;
    private Integer grade;
    private String parentReviewId;
}
