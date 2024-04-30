package com.hiringPlatform.candidate.model.response;

import com.hiringPlatform.candidate.model.request.StageHelperRequest;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationResponse {
    private String cvId;
    private String cvName;
    private String status;
    private Date appDate;
    private String refusalReason;
    private String candidateLastname;
    private String candidateFirstname;
    private String candidateEmail;
    private String employerCompanyName;
    private String employerEmail;
    private JobResponse job;
    private String stageName;
    private Integer stageNr;
    private List<StageHelperRequest> allStages;
}
