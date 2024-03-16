package com.hiringPlatform.employer.model;

import com.hiringPlatform.employer.model.CV;
import com.hiringPlatform.employer.model.Candidate;
import com.hiringPlatform.employer.model.Job;
import com.hiringPlatform.employer.model.Stage;
import com.hiringPlatform.employer.model.key.ApplicationId;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "aplica")
@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Application {

    @EmbeddedId
    private ApplicationId applicationId;

    @Column(name = "data_aplicarii")
    private Date applicationDate;

    @Column(name = "status")
    private String status;

    @Column(name = "motiv_refuz")
    private String refusalReason;

    @ManyToOne(cascade={CascadeType.MERGE}, fetch= FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name ="id_etapa_curenta")
    private Stage stage;

    public CV getCv() {
        return applicationId.getCv();
    }

    public Candidate getCandidate() {
        return applicationId.getCandidate();
    }

    public Job getJob() {
        return applicationId.getJob();
    }

    public ApplicationId getId() {
        return applicationId;
    }

    public void setApplicationId() {
        this.applicationId = new ApplicationId();
    }

    public void setCv(CV cv) {
        this.applicationId.setCv(cv);
    }

    public void setJob(Job job) {
        this.applicationId.setJob(job);
    }

    public void setCandidate(Candidate candidate) {
        this.applicationId.setCandidate(candidate);
    }
}
