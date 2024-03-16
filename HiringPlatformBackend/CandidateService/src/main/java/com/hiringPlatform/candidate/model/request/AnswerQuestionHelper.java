package com.hiringPlatform.candidate.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@AllArgsConstructor
public class AnswerQuestionHelper {

    private String questionText;
    private Integer questionNumber;
    private String answer;
}
