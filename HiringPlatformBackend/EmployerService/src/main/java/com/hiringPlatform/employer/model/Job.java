package com.hiringPlatform.employer.model;

import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "locuri_de_munca")
@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Job {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "id_loc_de_munca")
    private String jobId;

    @Column(name = "titlu")
    private String title;

    @Column(name = "descriere")
    private String description;

    @Column(name = "status")
    private String status;

    @Column(name = "tip_contract")
    private String contractType;

    @Column(name = "regim_angajare")
    private String employmentRegime;

    @Column(name = "data_postarii")
    private Date postingDate;

    @Column(name = "industrie")
    private String industry;

    @Column(name = "mod_lucru")
    private String workMode;

    @Column(name = "experienta")
    private String experience;

    @ManyToOne(cascade={CascadeType.MERGE}, fetch=FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name ="id_oras")
    private City city;

    @ManyToOne(cascade={CascadeType.MERGE}, fetch=FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name ="id_angajator")
    private Employer employer;
}
