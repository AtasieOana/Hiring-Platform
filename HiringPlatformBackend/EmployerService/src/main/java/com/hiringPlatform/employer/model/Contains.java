package com.hiringPlatform.employer.model;

import com.hiringPlatform.employer.model.key.ContainsId;
import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "contine")
@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Contains {

    @EmbeddedId
    private ContainsId containsId;

    @Column(name = "nr_etapa")
    private Integer stageNr;

    public Stage getStage() {
        return containsId.getStage();
    }

    public Job getJob() {
        return containsId.getJob();
    }

    public ContainsId getId() {
        return containsId;
    }

    public void setContainsId() {
        this.containsId = new ContainsId();
    }

    public void setStage(Stage Stage) {
        this.containsId.setStage(Stage);
    }

    public void setJob(Job job) {
        this.containsId.setJob(job);
    }
}
