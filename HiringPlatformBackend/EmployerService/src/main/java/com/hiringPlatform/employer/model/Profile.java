package com.hiringPlatform.employer.model;

import com.hiringPlatform.employer.model.Address;
import com.hiringPlatform.employer.model.Employer;
import com.hiringPlatform.employer.model.User;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "profiluri")
@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Profile {

    @Id
    @Column(name = "id_profil")
    private String profileId;

    @Lob
    @Column(name = "imagine", columnDefinition = "BLOB")
    private byte[] imagine;

    @Column(name = "descriere")
    private String description;

    @Column(name = "nr_telefon")
    private String phone;

    @Column(name = "site_oficial")
    private String site;

    @OneToOne(cascade={CascadeType.MERGE}, fetch=FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name ="id_adresa")
    private Address address;

    @OneToOne(cascade={CascadeType.MERGE}, fetch=FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name ="id_angajator")
    private Employer employer;
}