package com.hiringPlatform.candidate.model;

import javax.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "roluri")
@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Role {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "id_rol")
    private String roleId;

    @Column(name = "nume_rol")
    private String roleName;

    @Column(name = "descriere")
    private String roleDescription;
}