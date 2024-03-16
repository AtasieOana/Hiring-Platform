package com.hiringPlatform.candidate.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Data
@AllArgsConstructor
public class AnswerQuestionRequest {

    String candidateId;
    String jobId;
    List<AnswerQuestionHelper> answerQuestionHelperList;
}
