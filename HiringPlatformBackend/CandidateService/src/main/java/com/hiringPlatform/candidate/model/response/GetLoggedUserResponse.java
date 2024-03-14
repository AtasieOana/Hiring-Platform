package com.hiringPlatform.candidate.model.response;

import com.hiringPlatform.candidate.model.Candidate;
import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetLoggedUserResponse {
    private Candidate candidate;
    private String token;
    private Boolean hasCv;
}
