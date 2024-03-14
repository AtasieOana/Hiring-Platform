package com.hiringPlatform.candidate.model.key;

import com.hiringPlatform.candidate.model.CV;
import com.hiringPlatform.candidate.model.Candidate;
import com.hiringPlatform.candidate.model.Job;
import com.hiringPlatform.candidate.model.Stage;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.io.Serializable;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ApplicationId implements Serializable {

    private static final long serialVersionUID = 2L;

    @ManyToOne(cascade={CascadeType.MERGE}, fetch= FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name ="id_loc_de_munca")
    private Job job;

    @ManyToOne(cascade={CascadeType.MERGE}, fetch=FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name ="id_cv")
    private CV cv;

    @ManyToOne(cascade={CascadeType.MERGE}, fetch=FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name ="id_candidat")
    private Candidate candidate;
}