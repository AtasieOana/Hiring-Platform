package com.hiringPlatform.candidate.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCandidateAccount {

    private String email;
    private String newFirstName;
    private String newLastName;
    private String newPassword;
}
