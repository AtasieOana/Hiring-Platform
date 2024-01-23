package com.hiringPlatform.authentication.model;

import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "utilizatori")
@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "id_utilizator")
    private String userId;

    @Column(name = "email")
    private String email;

    @Column(name = "parola")
    private String password;

    @Column(name = "nume_de_utilizator")
    private String username;

    @Column(name = "data_inregistrare")
    private Date registrationDate;

    @Column(name = "cont_activat")
    private Integer accountEnabled;

    @ManyToOne(cascade={CascadeType.MERGE}, fetch=FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name ="id_rol")
    private Role userRole;
}