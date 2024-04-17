package com.hiringPlatform.employer.model.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateProfileRequest {

    private MultipartFile imagine;
    private String description;
    private String phone;
    private String site;
    private String street;
    private String zipCode;
    private String cityName;
    private String regionName;
    private String employerId;
}
