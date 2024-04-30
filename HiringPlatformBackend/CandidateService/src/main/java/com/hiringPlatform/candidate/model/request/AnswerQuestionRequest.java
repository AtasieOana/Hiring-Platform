package com.hiringPlatform.candidate.model.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnswerQuestionRequest {

    String candidateId;
    String jobId;
    List<AnswerQuestionHelper> answerQuestionHelperList;
}
