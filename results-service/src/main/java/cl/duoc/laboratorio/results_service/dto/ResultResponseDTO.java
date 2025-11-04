package cl.duoc.laboratorio.results_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResultResponseDTO {

    private Long id;
    private Long userId;
    private Long labId;
    private String labName;
    private String testType;
    private String valueJson;
    private String status;
    private LocalDate resultDate;
}
