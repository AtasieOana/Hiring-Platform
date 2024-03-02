package com.hiringPlatform.employer.model;

import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "intrebari")
@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Question {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "id_intrebare")
    private String questionId;

    @Column(name = "text_intrebare")
    private String questionText;

    @Column(name = "nr_intrebare")
    private Integer questionNumber;

    @ManyToOne(cascade={CascadeType.MERGE}, fetch=FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name ="id_loc_de_munca")
    private Job job;
}
