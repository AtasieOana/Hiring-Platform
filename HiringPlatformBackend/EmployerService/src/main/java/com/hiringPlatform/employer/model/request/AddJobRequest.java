package com.hiringPlatform.employer.model.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
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
