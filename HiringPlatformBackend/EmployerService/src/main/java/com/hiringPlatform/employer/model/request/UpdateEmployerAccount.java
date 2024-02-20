package com.hiringPlatform.employer.model.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateEmployerAccount {

    private String email;
    private String newCompanyName;
    private String newPassword;
}
