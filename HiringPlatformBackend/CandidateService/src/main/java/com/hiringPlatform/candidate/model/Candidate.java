package com.hiringPlatform.candidate.model;

import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "candidati")
@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Candidate {

    @Id
    @Column(name = "id_candidat")
    private String candidateId;

    @Column(name = "nume")
    private String lastname;

    @Column(name = "prenume")
    private String firstname;

    @OneToOne(cascade={CascadeType.MERGE}, fetch=FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name ="id_candidat")
    private User userDetails;
}