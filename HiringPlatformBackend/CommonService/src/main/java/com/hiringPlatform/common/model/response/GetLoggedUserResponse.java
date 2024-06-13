package com.hiringPlatform.common.model.response;

import com.hiringPlatform.common.model.Candidate;
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
