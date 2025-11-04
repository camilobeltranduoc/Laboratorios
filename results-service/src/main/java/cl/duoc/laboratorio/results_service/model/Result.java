package cl.duoc.laboratorio.results_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "RESULTS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "result_seq")
    @SequenceGenerator(name = "result_seq", sequenceName = "RESULTS_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "USER_ID", nullable = false)
    private Long userId;

    @Column(name = "LAB_ID", nullable = false)
    private Long labId;

    @Column(name = "TEST_TYPE", length = 100)
    private String testType;

    @Lob
    @Column(name = "VALUE_JSON")
    private String valueJson;

    @Column(name = "STATUS", length = 50)
    private String status;

    @Column(name = "RESULT_DATE")
    private LocalDate resultDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "LAB_ID", insertable = false, updatable = false)
    private Lab lab;
}
