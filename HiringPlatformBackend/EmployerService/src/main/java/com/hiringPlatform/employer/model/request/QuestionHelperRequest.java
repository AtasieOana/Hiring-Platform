package com.hiringPlatform.employer.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@AllArgsConstructor
public class QuestionHelperRequest {

    private String questionText;
    private Number questionNumber;
}
