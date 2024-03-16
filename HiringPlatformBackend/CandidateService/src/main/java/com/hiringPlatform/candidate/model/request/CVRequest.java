package com.hiringPlatform.candidate.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CVRequest {
    private String fileName;
    private String candidateId;
}
