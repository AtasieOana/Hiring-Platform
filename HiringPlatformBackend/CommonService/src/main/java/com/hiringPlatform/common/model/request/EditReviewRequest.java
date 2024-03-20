package com.hiringPlatform.common.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EditReviewRequest {

    private String reviewId;
    private String newComment;
    private Integer newGrade;
}
