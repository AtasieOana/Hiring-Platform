package com.hiringPlatform.employer.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnswerHelperRequest {

    private String questionText;
    private Integer questionNumber;
    private String answer;
}
