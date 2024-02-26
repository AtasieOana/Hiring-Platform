package com.hiringPlatform.employer.model.key;

import com.hiringPlatform.employer.model.Job;
import com.hiringPlatform.employer.model.Stage;
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
public class ContainsId implements Serializable {

    private static final long serialVersionUID = 2L;

    @ManyToOne(cascade={CascadeType.MERGE}, fetch= FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name ="id_etapa")
    private Stage stage;

    @ManyToOne(cascade={CascadeType.MERGE}, fetch=FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name ="id_loc_de_munca")
    private Job job;
}