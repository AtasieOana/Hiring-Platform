package com.hiringPlatform.candidate.model;

import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "angajatori")
@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Employer {

    @Id
    @Column(name = "id_angajator")
    private String employerId;

    @Column(name = "nume_companie")
    private String companyName;

    @OneToOne(cascade={CascadeType.MERGE}, fetch=FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name ="id_angajator")
    private User userDetails;
}