package com.hiringPlatform.admin.model.response;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OverviewResponse {

    private Integer numberOfCandidates;
    private Integer numberOfAdmins;
    private Integer numberOfEmployers;
    private Integer numberOfJobs;
    private Integer numberOfApplications;
}
