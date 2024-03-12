package com.hiringPlatform.candidate.model.response;

import com.hiringPlatform.candidate.model.Candidate;
import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateResponse {
    private Candidate candidate;
    private String token;
}
