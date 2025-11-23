package cl.duoc.laboratorio.labs_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "LABS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lab {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "labs_seq")
    @SequenceGenerator(name = "labs_seq", sequenceName = "LABS_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "NAME", nullable = false, length = 100)
    private String name;
}
