package com.hiringPlatform.employer.model.response;

import com.hiringPlatform.employer.model.Employer;
import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetLoggedUserResponse {
    private Employer employer;
    private String token;
    private Boolean hasProfile;
}
