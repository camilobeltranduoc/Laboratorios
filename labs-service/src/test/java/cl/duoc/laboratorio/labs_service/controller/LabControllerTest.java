package cl.duoc.laboratorio.labs_service.controller;

import cl.duoc.laboratorio.labs_service.dto.LabRequestDTO;
import cl.duoc.laboratorio.labs_service.dto.LabResponseDTO;
import cl.duoc.laboratorio.labs_service.exception.ResourceNotFoundException;
import cl.duoc.laboratorio.labs_service.service.LabService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests unitarios para LabController
 * Cobertura: REST endpoints + Validaciones HTTP
 */
@WebMvcTest(LabController.class)
class LabControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private LabService labService;

    private LabRequestDTO labRequestDTO;
    private LabResponseDTO labResponseDTO;

    @BeforeEach
    void setUp() {
        // Setup request DTO
        labRequestDTO = new LabRequestDTO();
        labRequestDTO.setName("Laboratorio Central");

        // Setup response DTO
        labResponseDTO = new LabResponseDTO(1L, "Laboratorio Central");
    }

    @Test
    @DisplayName("POST /api/labs - Crear laboratorio exitoso")
    void testCreateLab_Success() throws Exception {
        // Given
        when(labService.createLab(any(LabRequestDTO.class))).thenReturn(labResponseDTO);

        // When & Then
        mockMvc.perform(post("/api/labs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(labRequestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Laboratorio Central"));

        verify(labService, times(1)).createLab(any(LabRequestDTO.class));
    }

    @Test
    @DisplayName("POST /api/labs - Nombre duplicado (400)")
    void testCreateLab_DuplicateName() throws Exception {
        // Given
        when(labService.createLab(any(LabRequestDTO.class)))
            .thenThrow(new IllegalArgumentException("Ya existe un laboratorio con el nombre: Laboratorio Central"));

        // When & Then
        mockMvc.perform(post("/api/labs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(labRequestDTO)))
                .andExpect(status().isBadRequest());

        verify(labService, times(1)).createLab(any(LabRequestDTO.class));
    }

    @Test
    @DisplayName("GET /api/labs/{id} - Obtener laboratorio exitoso")
    void testGetLabById_Success() throws Exception {
        // Given
        when(labService.getLabById(1L)).thenReturn(labResponseDTO);

        // When & Then
        mockMvc.perform(get("/api/labs/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Laboratorio Central"));

        verify(labService, times(1)).getLabById(1L);
    }

    @Test
    @DisplayName("GET /api/labs/{id} - Laboratorio no encontrado (404)")
    void testGetLabById_NotFound() throws Exception {
        // Given
        when(labService.getLabById(999L))
            .thenThrow(new ResourceNotFoundException("Laboratorio no encontrado con ID: 999"));

        // When & Then
        mockMvc.perform(get("/api/labs/999"))
                .andExpect(status().isNotFound());

        verify(labService, times(1)).getLabById(999L);
    }

    @Test
    @DisplayName("GET /api/labs - Obtener todos los laboratorios")
    void testGetAllLabs_Success() throws Exception {
        // Given
        LabResponseDTO lab2 = new LabResponseDTO(2L, "Laboratorio Norte");
        List<LabResponseDTO> labs = Arrays.asList(labResponseDTO, lab2);
        when(labService.getAllLabs()).thenReturn(labs);

        // When & Then
        mockMvc.perform(get("/api/labs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Laboratorio Central"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].name").value("Laboratorio Norte"));

        verify(labService, times(1)).getAllLabs();
    }

    @Test
    @DisplayName("PUT /api/labs/{id} - Actualizar laboratorio exitoso")
    void testUpdateLab_Success() throws Exception {
        // Given
        LabResponseDTO updatedLab = new LabResponseDTO(1L, "Laboratorio Actualizado");
        when(labService.updateLab(eq(1L), any(LabRequestDTO.class))).thenReturn(updatedLab);

        // When & Then
        mockMvc.perform(put("/api/labs/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(labRequestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Laboratorio Actualizado"));

        verify(labService, times(1)).updateLab(eq(1L), any(LabRequestDTO.class));
    }

    @Test
    @DisplayName("PUT /api/labs/{id} - Laboratorio no encontrado (404)")
    void testUpdateLab_NotFound() throws Exception {
        // Given
        when(labService.updateLab(eq(999L), any(LabRequestDTO.class)))
            .thenThrow(new ResourceNotFoundException("Laboratorio no encontrado con ID: 999"));

        // When & Then
        mockMvc.perform(put("/api/labs/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(labRequestDTO)))
                .andExpect(status().isNotFound());

        verify(labService, times(1)).updateLab(eq(999L), any(LabRequestDTO.class));
    }

    @Test
    @DisplayName("DELETE /api/labs/{id} - Eliminar laboratorio exitoso")
    void testDeleteLab_Success() throws Exception {
        // Given
        doNothing().when(labService).deleteLab(1L);

        // When & Then
        mockMvc.perform(delete("/api/labs/1"))
                .andExpect(status().isNoContent());

        verify(labService, times(1)).deleteLab(1L);
    }

    @Test
    @DisplayName("DELETE /api/labs/{id} - Laboratorio no encontrado (404)")
    void testDeleteLab_NotFound() throws Exception {
        // Given
        doThrow(new ResourceNotFoundException("Laboratorio no encontrado con ID: 999"))
            .when(labService).deleteLab(999L);

        // When & Then
        mockMvc.perform(delete("/api/labs/999"))
                .andExpect(status().isNotFound());

        verify(labService, times(1)).deleteLab(999L);
    }
}
