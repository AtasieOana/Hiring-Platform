package com.hiringPlatform.candidate.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnswerQuestionHelper {

    private String questionText;
    private Integer questionNumber;
    private String answer;
}
