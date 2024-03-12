package com.hiringPlatform.candidate.model;

import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "orase")
@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class City {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "id_oras")
    private String cityId;

    @Column(name = "nume")
    private String cityName;


    @ManyToOne(cascade={CascadeType.MERGE}, fetch=FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name ="id_regiune")
    private Region region;
}
