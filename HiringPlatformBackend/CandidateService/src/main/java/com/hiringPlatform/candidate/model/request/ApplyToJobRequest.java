package com.hiringPlatform.candidate.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplyToJobRequest {
    private String jobId;
    private String candidateId;
    private String cvId;
}
