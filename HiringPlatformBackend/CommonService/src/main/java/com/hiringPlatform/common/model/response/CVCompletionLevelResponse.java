package com.hiringPlatform.common.model.response;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CVCompletionLevelResponse {

    private Boolean hasPhoneNumber;
    private Boolean hasEmail;
    private Boolean hasEducationSection;
    private Boolean hasExperienceSection;
    private Boolean hasSkillsInCV;
    private Integer completenessScore;

}
