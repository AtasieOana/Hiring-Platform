package com.hiringPlatform.candidate.model.request;

import com.hiringPlatform.candidate.model.Candidate;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CVRequest {
    private String fileName;
    private String candidateId;
}
