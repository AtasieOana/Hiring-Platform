package com.hiringPlatform.employer.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@AllArgsConstructor
public class StageHelperRequest {

    private String stageName;
    private Number stageNr;
}
