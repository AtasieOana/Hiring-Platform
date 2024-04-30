package com.hiringPlatform.employer.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionHelperRequest {

    private String questionText;
    private Integer questionNumber;
}
