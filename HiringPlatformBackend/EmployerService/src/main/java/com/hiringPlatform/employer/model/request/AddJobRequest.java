package com.hiringPlatform.employer.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Data
@AllArgsConstructor
public class AddJobRequest {

    private String title;
    private String description;
    private String contractType;
    private String employmentRegime;
    private String experience;
    private String industry;
    private String workMode;
    private String cityName;
    private String regionName;
    private String employerId;
    List<QuestionHelperRequest> questions;
    List<StageHelperRequest> stages;
}
