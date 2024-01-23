package com.hiringPlatform.authentication.model;

import javax.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;

@Entity
@Table(name = "token_autentificare")
@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationToken {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "id_token")
    private String tokenId;

    @Column(name = "data_expirare")
    private Date expiryDate;

    @Column(name = "token")
    private String token;

    @ManyToOne(cascade={CascadeType.MERGE}, fetch=FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name ="id_utilizator")
    private User user;
}