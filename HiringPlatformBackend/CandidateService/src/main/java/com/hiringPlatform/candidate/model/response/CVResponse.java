package com.hiringPlatform.candidate.model.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CVResponse {
    private String cvId;
    private String cvName;
    private String uploadDate;
    private String candidateLastname;
    private String candidateFirstname;
    private String candidateEmail;
}
