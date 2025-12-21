package cl.duoc.laboratorio.results_service.controller;

import cl.duoc.laboratorio.results_service.dto.LabDTO;
import cl.duoc.laboratorio.results_service.dto.ResultRequestDTO;
import cl.duoc.laboratorio.results_service.dto.ResultResponseDTO;
import cl.duoc.laboratorio.results_service.exception.ResourceNotFoundException;
import cl.duoc.laboratorio.results_service.service.LabService;
import cl.duoc.laboratorio.results_service.service.ResultService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests unitarios para ResultController
 * Cobertura: REST endpoints + Validaciones HTTP
 */
@WebMvcTest(ResultController.class)
class ResultControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ResultService resultService;

    @MockitoBean
    private LabService labService;

    private ResultRequestDTO resultRequestDTO;
    private ResultResponseDTO resultResponseDTO;

    @BeforeEach
    void setUp() {
        // Setup request DTO
        resultRequestDTO = new ResultRequestDTO();
        resultRequestDTO.setUserId(100L);
        resultRequestDTO.setLabId(1L);
        resultRequestDTO.setTestType("Hemograma");
        resultRequestDTO.setValueJson("{\"hemoglobina\": 14.5}");
        resultRequestDTO.setStatus("COMPLETADO");
        resultRequestDTO.setResultDate(LocalDate.of(2024, 1, 15));

        // Setup response DTO
        resultResponseDTO = new ResultResponseDTO();
        resultResponseDTO.setId(1L);
        resultResponseDTO.setUserId(100L);
        resultResponseDTO.setLabId(1L);
        resultResponseDTO.setLabName("Laboratorio Central");
        resultResponseDTO.setTestType("Hemograma");
        resultResponseDTO.setValueJson("{\"hemoglobina\": 14.5}");
        resultResponseDTO.setStatus("COMPLETADO");
        resultResponseDTO.setResultDate(LocalDate.of(2024, 1, 15));
    }

    @Test
    @DisplayName("GET /api/results/labs - Obtener todos los laboratorios")
    void testGetAllLabs_Success() throws Exception {
        // Given
        List<LabDTO> labs = Arrays.asList(
            new LabDTO(1L, "Laboratorio Central"),
            new LabDTO(2L, "Laboratorio Norte")
        );
        when(labService.getAllLabs()).thenReturn(labs);

        // When & Then
        mockMvc.perform(get("/api/results/labs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Laboratorio Central"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].name").value("Laboratorio Norte"));

        verify(labService, times(1)).getAllLabs();
    }

    @Test
    @DisplayName("POST /api/results - Crear resultado exitoso")
    void testCreateResult_Success() throws Exception {
        // Given
        when(resultService.createResult(any(ResultRequestDTO.class))).thenReturn(resultResponseDTO);

        // When & Then
        mockMvc.perform(post("/api/results")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(resultRequestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.userId").value(100))
                .andExpect(jsonPath("$.labId").value(1))
                .andExpect(jsonPath("$.testType").value("Hemograma"))
                .andExpect(jsonPath("$.status").value("COMPLETADO"));

        verify(resultService, times(1)).createResult(any(ResultRequestDTO.class));
    }

    @Test
    @DisplayName("POST /api/results - Laboratorio no encontrado (404)")
    void testCreateResult_LabNotFound() throws Exception {
        // Given
        when(resultService.createResult(any(ResultRequestDTO.class)))
            .thenThrow(new ResourceNotFoundException("Laboratorio no encontrado con id: 1"));

        // When & Then
        mockMvc.perform(post("/api/results")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(resultRequestDTO)))
                .andExpect(status().isNotFound());

        verify(resultService, times(1)).createResult(any(ResultRequestDTO.class));
    }

    @Test
    @DisplayName("GET /api/results/{id} - Obtener resultado exitoso")
    void testGetResultById_Success() throws Exception {
        // Given
        when(resultService.getResultById(1L)).thenReturn(resultResponseDTO);

        // When & Then
        mockMvc.perform(get("/api/results/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.userId").value(100))
                .andExpect(jsonPath("$.testType").value("Hemograma"));

        verify(resultService, times(1)).getResultById(1L);
    }

    @Test
    @DisplayName("GET /api/results/{id} - Resultado no encontrado (404)")
    void testGetResultById_NotFound() throws Exception {
        // Given
        when(resultService.getResultById(999L))
            .thenThrow(new ResourceNotFoundException("Resultado no encontrado con id: 999"));

        // When & Then
        mockMvc.perform(get("/api/results/999"))
                .andExpect(status().isNotFound());

        verify(resultService, times(1)).getResultById(999L);
    }

    @Test
    @DisplayName("GET /api/results/by-user/{userId} - Obtener resultados por usuario")
    void testGetResultsByUserId_Success() throws Exception {
        // Given
        ResultResponseDTO result2 = new ResultResponseDTO();
        result2.setId(2L);
        result2.setUserId(100L);
        result2.setLabId(1L);
        result2.setTestType("Glucosa");
        result2.setStatus("PENDIENTE");

        List<ResultResponseDTO> results = Arrays.asList(resultResponseDTO, result2);
        when(resultService.getResultsByUserId(100L)).thenReturn(results);

        // When & Then
        mockMvc.perform(get("/api/results/by-user/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].testType").value("Hemograma"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].testType").value("Glucosa"));

        verify(resultService, times(1)).getResultsByUserId(100L);
    }

    @Test
    @DisplayName("GET /api/results/by-user/{userId} - Sin resultados")
    void testGetResultsByUserId_EmptyList() throws Exception {
        // Given
        when(resultService.getResultsByUserId(100L)).thenReturn(Arrays.asList());

        // When & Then
        mockMvc.perform(get("/api/results/by-user/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());

        verify(resultService, times(1)).getResultsByUserId(100L);
    }

    @Test
    @DisplayName("PUT /api/results/{id} - Actualizar resultado exitoso")
    void testUpdateResult_Success() throws Exception {
        // Given
        ResultResponseDTO updatedResult = new ResultResponseDTO();
        updatedResult.setId(1L);
        updatedResult.setUserId(100L);
        updatedResult.setLabId(1L);
        updatedResult.setTestType("Hemograma Completo");
        updatedResult.setStatus("REVISADO");
        updatedResult.setResultDate(LocalDate.of(2024, 1, 16));

        when(resultService.updateResult(eq(1L), any(ResultRequestDTO.class))).thenReturn(updatedResult);

        // When & Then
        mockMvc.perform(put("/api/results/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(resultRequestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.testType").value("Hemograma Completo"))
                .andExpect(jsonPath("$.status").value("REVISADO"));

        verify(resultService, times(1)).updateResult(eq(1L), any(ResultRequestDTO.class));
    }

    @Test
    @DisplayName("PUT /api/results/{id} - Resultado no encontrado (404)")
    void testUpdateResult_NotFound() throws Exception {
        // Given
        when(resultService.updateResult(eq(999L), any(ResultRequestDTO.class)))
            .thenThrow(new ResourceNotFoundException("Resultado no encontrado con id: 999"));

        // When & Then
        mockMvc.perform(put("/api/results/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(resultRequestDTO)))
                .andExpect(status().isNotFound());

        verify(resultService, times(1)).updateResult(eq(999L), any(ResultRequestDTO.class));
    }

    @Test
    @DisplayName("DELETE /api/results/{id} - Eliminar resultado exitoso")
    void testDeleteResult_Success() throws Exception {
        // Given
        doNothing().when(resultService).deleteResult(1L);

        // When & Then
        mockMvc.perform(delete("/api/results/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Resultado eliminado correctamente"));

        verify(resultService, times(1)).deleteResult(1L);
    }

    @Test
    @DisplayName("DELETE /api/results/{id} - Resultado no encontrado (404)")
    void testDeleteResult_NotFound() throws Exception {
        // Given
        doThrow(new ResourceNotFoundException("Resultado no encontrado con id: 999"))
            .when(resultService).deleteResult(999L);

        // When & Then
        mockMvc.perform(delete("/api/results/999"))
                .andExpect(status().isNotFound());

        verify(resultService, times(1)).deleteResult(999L);
    }
}
