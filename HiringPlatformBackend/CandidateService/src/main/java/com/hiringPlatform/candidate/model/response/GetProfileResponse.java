package com.hiringPlatform.candidate.model.response;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetProfileResponse {

    private String imagine;
    private String description;
    private String phone;
    private String site;
    private String street;
    private String zipCode;
    private String cityName;
    private String regionName;
    private String countryName;
}
