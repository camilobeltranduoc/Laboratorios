package cl.duoc.laboratorio.results_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResultRequestDTO {

    @NotNull(message = "El ID del usuario es obligatorio")
    private Long userId;

    @NotNull(message = "El ID del laboratorio es obligatorio")
    private Long labId;

    private String testType;

    private String valueJson;

    private String status;

    private LocalDate resultDate;
}
