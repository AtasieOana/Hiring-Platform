package com.hiringPlatform.employer.model.response;

import com.hiringPlatform.employer.model.request.QuestionHelperRequest;
import com.hiringPlatform.employer.model.request.StageHelperRequest;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobResponse {

    private String jobId;
    private String title;
    private String description;
    private String contractType;
    private String employmentRegime;
    private String experience;
    private String industry;
    private String workMode;
    private Date postingDate;
    private String cityName;
    private String regionName;
    private String countryName;
    private String employerId;
    List<QuestionHelperRequest> questions;
    List<StageHelperRequest> stages;
}
