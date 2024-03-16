package com.hiringPlatform.employer.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateApplicationRequest {
    private String jobId;
    private String candidateId;
}
