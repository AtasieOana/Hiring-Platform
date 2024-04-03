package com.hiringPlatform.common.model;

import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table(name = "etape")
@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Stage {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "id_etapa")
    private String stageId;

    @Column(name = "nume_etapa")
    private String stageName;
}
